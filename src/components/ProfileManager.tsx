import { useState, useEffect } from 'react';
import { User, Plus, Trash2, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Category,
  PatternType,
  Measurements,
  UnifiedMeasurements,
  toSkirtMeasurements,
  toBodiceMeasurements,
  toPantsMeasurements,
  toSleeveMeasurements,
} from '@/types/sloper';
import { useLanguage } from '@/contexts/LanguageContext';
import { defaultUnifiedMeasurements } from '@/components/UnifiedMeasurementForm';

// Profiles are stored as full body-measurement sets shared across every garment
// (pattern_type 'unified'), matching ProfileManagerSimple. Older profiles saved
// before this was unified only ever held one garment's fields (e.g. a 'skirt' row
// has no thigh/hipHeight/etc.) — fill any missing field from category defaults
// first so switching to a garment absent from a legacy row never yields
// `undefined` measurements (which crashes the pattern preview's `.toFixed()` calls).
function toGarmentMeasurements(patternType: PatternType, category: Category, u: UnifiedMeasurements): Measurements {
  const full: UnifiedMeasurements = { ...defaultUnifiedMeasurements[category], ...u };
  if (patternType.startsWith('bodice')) return toBodiceMeasurements(full);
  if (patternType.startsWith('pants')) return toPantsMeasurements(full);
  if (patternType === 'sleeve') return toSleeveMeasurements(full);
  return toSkirtMeasurements(full);
}

interface SavedProfile {
  id: string;
  name: string;
  measurements: UnifiedMeasurements;
  created_at: string;
}

interface ProfileManagerProps {
  userId: string;
  category: Category;
  patternType: PatternType;
  currentMeasurements: Measurements;
  onLoadProfile: (measurements: Measurements) => void;
  onProfileSaved?: () => void;
  onProfileNameChange?: (name: string | null) => void;
}

export function ProfileManager({
  userId,
  category,
  patternType,
  currentMeasurements,
  onLoadProfile,
  onProfileSaved,
  onProfileNameChange,
}: ProfileManagerProps) {
  const { t } = useLanguage();
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, [userId, category]);

  // The garment tab (patternType) can change without this component unmounting
  // (no key prop on <ProfileManager>). Re-derive the garment-specific measurements
  // from the already-selected shared profile so switching tabs doesn't leave the
  // pattern preview showing stale/default values for the new tab.
  useEffect(() => {
    if (!selectedProfileId) return;
    const profile = profiles.find((p) => p.id === selectedProfileId);
    if (profile) {
      onLoadProfile(toGarmentMeasurements(patternType, category, profile.measurements));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patternType]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_measurements')
        .select('id, name, measurements, created_at')
        .eq('user_id', userId)
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Profiles are body-measurement sets shared across garments; dedupe by name
      // the same way ProfileManagerSimple does, so both screens show the same list.
      const uniqueProfiles = new Map<string, SavedProfile>();
      (data || []).forEach((item) => {
        if (!uniqueProfiles.has(item.name)) {
          uniqueProfiles.set(item.name, {
            id: item.id,
            name: item.name,
            measurements: item.measurements as unknown as UnifiedMeasurements,
            created_at: item.created_at,
          });
        }
      });
      const parsed = Array.from(uniqueProfiles.values());

      setProfiles(parsed);

      if (parsed.length > 0 && !selectedProfileId) {
        setSelectedProfileId(parsed[0].id);
        onLoadProfile(toGarmentMeasurements(patternType, category, parsed[0].measurements));
        onProfileNameChange?.(parsed[0].name);
      } else if (parsed.length === 0) {
        onProfileNameChange?.(null);
      }
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (profileId: string) => {
    setSelectedProfileId(profileId);
    const profile = profiles.find((p) => p.id === profileId);
    if (profile) {
      onLoadProfile(toGarmentMeasurements(patternType, category, profile.measurements));
      onProfileNameChange?.(profile.name);
      toast.success(`${t('profile.loaded')} "${profile.name}"`);
    }
  };

  const handleSaveNew = async () => {
    if (!newProfileName.trim()) {
      toast.error(t('profile.enterName'));
      return;
    }

    setSaving(true);
    try {
      // currentMeasurements only carries this garment's fields; fill the rest of the
      // shared profile from category defaults so other garments' data isn't lost.
      const unifiedMeasurements: UnifiedMeasurements = {
        ...defaultUnifiedMeasurements[category],
        ...currentMeasurements,
      };
      const { data, error } = await supabase
        .from('saved_measurements')
        .insert([{
          user_id: userId,
          category,
          pattern_type: 'unified',
          name: newProfileName.trim(),
          measurements: JSON.parse(JSON.stringify(unifiedMeasurements)),
        }])
        .select('id, name, measurements, created_at')
        .single();

      if (error) throw error;

      const newProfile: SavedProfile = {
        id: data.id,
        name: data.name,
        measurements: data.measurements as unknown as UnifiedMeasurements,
        created_at: data.created_at,
      };

      setProfiles((prev) => [newProfile, ...prev]);
      setSelectedProfileId(newProfile.id);
      setSaveDialogOpen(false);
      setNewProfileName('');
      toast.success(`"${newProfile.name}" ${t('profile.saved')}`);
      onProfileSaved?.();
    } catch (err) {
      console.error('Save error:', err);
      toast.error(t('profile.failedSave'));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCurrent = async () => {
    if (!selectedProfileId) return;
    const profile = profiles.find((p) => p.id === selectedProfileId);
    if (!profile) return;

    setSaving(true);
    try {
      // Only this garment's fields changed locally; merge them onto the existing
      // shared profile instead of overwriting it, so other garments' measurements
      // saved on this same profile are preserved. Also backfills any field a
      // pre-unification legacy row never had, healing it going forward.
      const unifiedMeasurements: UnifiedMeasurements = {
        ...defaultUnifiedMeasurements[category],
        ...profile.measurements,
        ...currentMeasurements,
      };
      const { error } = await supabase
        .from('saved_measurements')
        .update({ measurements: JSON.parse(JSON.stringify(unifiedMeasurements)) })
        .eq('id', selectedProfileId);

      if (error) throw error;

      setProfiles((prev) =>
        prev.map((p) => p.id === selectedProfileId ? { ...p, measurements: unifiedMeasurements } : p)
      );

      toast.success(`"${profile.name}" ${t('profile.updated')}`);
      onProfileSaved?.();
    } catch (err) {
      console.error('Update error:', err);
      toast.error(t('profile.failedUpdate'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProfileId) return;
    const profile = profiles.find((p) => p.id === selectedProfileId);
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('saved_measurements')
        .delete()
        .eq('id', selectedProfileId);

      if (error) throw error;

      const remaining = profiles.filter((p) => p.id !== selectedProfileId);
      setProfiles(remaining);

      if (remaining.length > 0) {
        setSelectedProfileId(remaining[0].id);
        onLoadProfile(toGarmentMeasurements(patternType, category, remaining[0].measurements));
      } else {
        setSelectedProfileId(null);
      }

      setDeleteDialogOpen(false);
      toast.success(`"${profile.name}" ${t('profile.deleted')}`);
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(t('profile.failedDelete'));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">{t('label.profile')}</span>
      </div>

      <div className="flex gap-2">
        <Select
          value={selectedProfileId || ''}
          onValueChange={handleProfileChange}
          disabled={loading || profiles.length === 0}
        >
          <SelectTrigger className="flex-1">
            <SelectValue
              placeholder={
                loading
                  ? t('profile.loading')
                  : profiles.length === 0
                  ? t('profile.noSavedProfiles')
                  : t('profile.selectProfile')
              }
            />
          </SelectTrigger>
          <SelectContent>
            {profiles.map((profile) => (
              <SelectItem key={profile.id} value={profile.id}>
                {profile.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" onClick={() => setSaveDialogOpen(true)} title={t('action.saveAsNew')}>
          <Plus className="w-4 h-4" />
        </Button>

        {selectedProfileId && (
          <Button variant="outline" size="icon" onClick={() => setDeleteDialogOpen(true)} title={t('action.deleteProfile')} className="text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {selectedProfileId && (
        <Button variant="secondary" size="sm" className="w-full gap-2" onClick={handleUpdateCurrent} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {t('action.updateCurrentProfile')}
        </Button>
      )}

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('profile.saveNewTitle')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder={t('profile.namePlaceholder')}
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveNew()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)} disabled={saving}>
              {t('action.cancel')}
            </Button>
            <Button onClick={handleSaveNew} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {t('action.saveProfile')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('profile.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('profile.deleteDescription')} "{profiles.find((p) => p.id === selectedProfileId)?.name}". {t('profile.cannotBeUndone')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('action.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('action.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
