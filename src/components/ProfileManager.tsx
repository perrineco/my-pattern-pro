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
import { Category, PatternType, Measurements } from '@/types/sloper';

interface SavedProfile {
  id: string;
  name: string;
  measurements: Measurements;
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
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Dialog states
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  // Fetch profiles when user/category/patternType changes
  useEffect(() => {
    fetchProfiles();
  }, [userId, category, patternType]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_measurements')
        .select('id, name, measurements, created_at')
        .eq('user_id', userId)
        .eq('category', category)
        .eq('pattern_type', patternType)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const parsed = (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        measurements: item.measurements as unknown as Measurements,
        created_at: item.created_at,
      }));

      setProfiles(parsed);

      // Auto-select first profile if none selected
      if (parsed.length > 0 && !selectedProfileId) {
        setSelectedProfileId(parsed[0].id);
        onLoadProfile(parsed[0].measurements);
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
      onLoadProfile(profile.measurements);
      onProfileNameChange?.(profile.name);
      toast.success(`Loaded "${profile.name}"`);
    }
  };

  const handleSaveNew = async () => {
    if (!newProfileName.trim()) {
      toast.error('Please enter a profile name');
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('saved_measurements')
        .insert([
          {
            user_id: userId,
            category,
            pattern_type: patternType,
            name: newProfileName.trim(),
            measurements: JSON.parse(JSON.stringify(currentMeasurements)),
          },
        ])
        .select('id, name, measurements, created_at')
        .single();

      if (error) throw error;

      const newProfile: SavedProfile = {
        id: data.id,
        name: data.name,
        measurements: data.measurements as unknown as Measurements,
        created_at: data.created_at,
      };

      setProfiles((prev) => [newProfile, ...prev]);
      setSelectedProfileId(newProfile.id);
      setSaveDialogOpen(false);
      setNewProfileName('');
      toast.success(`Profile "${newProfile.name}" saved!`);
      onProfileSaved?.();
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save profile');
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
      const { error } = await supabase
        .from('saved_measurements')
        .update({
          measurements: JSON.parse(JSON.stringify(currentMeasurements)),
        })
        .eq('id', selectedProfileId);

      if (error) throw error;

      setProfiles((prev) =>
        prev.map((p) =>
          p.id === selectedProfileId
            ? { ...p, measurements: currentMeasurements }
            : p
        )
      );

      toast.success(`Profile "${profile.name}" updated!`);
      onProfileSaved?.();
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Failed to update profile');
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

      // Select next available profile
      if (remaining.length > 0) {
        setSelectedProfileId(remaining[0].id);
        onLoadProfile(remaining[0].measurements);
      } else {
        setSelectedProfileId(null);
      }

      setDeleteDialogOpen(false);
      toast.success(`Profile "${profile.name}" deleted`);
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete profile');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Profile</span>
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
                  ? 'Loading...'
                  : profiles.length === 0
                  ? 'No saved profiles'
                  : 'Select profile'
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

        <Button
          variant="outline"
          size="icon"
          onClick={() => setSaveDialogOpen(true)}
          title="Save as new profile"
        >
          <Plus className="w-4 h-4" />
        </Button>

        {selectedProfileId && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDeleteDialogOpen(true)}
            title="Delete profile"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {selectedProfileId && (
        <Button
          variant="secondary"
          size="sm"
          className="w-full gap-2"
          onClick={handleUpdateCurrent}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          Update Current Profile
        </Button>
      )}

      {/* Save New Profile Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save New Profile</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Profile name (e.g., 'My measurements', 'Client A')"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveNew()}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSaveDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveNew} disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Save Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profile?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "
              {profiles.find((p) => p.id === selectedProfileId)?.name}". This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
