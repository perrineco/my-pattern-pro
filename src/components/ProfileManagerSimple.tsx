import { useState, useEffect } from 'react';
import { User, Plus, Trash2, Check, Loader2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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
import { Category, UnifiedMeasurements } from '@/types/sloper';
import { cn } from '@/lib/utils';

interface SavedProfile {
  id: string;
  name: string;
  measurements: UnifiedMeasurements;
  created_at: string;
}

interface ProfileManagerSimpleProps {
  userId: string;
  category: Category;
  currentMeasurements: UnifiedMeasurements;
  onLoadProfile: (measurements: UnifiedMeasurements) => void;
  selectedProfileId: string | null;
  onSelectProfile: (id: string | null) => void;
}

export function ProfileManagerSimple({
  userId,
  category,
  currentMeasurements,
  onLoadProfile,
  selectedProfileId,
  onSelectProfile,
}: ProfileManagerSimpleProps) {
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Dialog states
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
  const [newProfileName, setNewProfileName] = useState('');

  // Fetch all profiles for this category (without pattern_type filter)
  useEffect(() => {
    fetchProfiles();
  }, [userId, category]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      // Fetch profiles without pattern_type filter - get all for this user/category
      const { data, error } = await supabase
        .from('saved_measurements')
        .select('id, name, measurements, created_at')
        .eq('user_id', userId)
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Deduplicate by name (keep the most recent)
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

      // Auto-select first profile if none selected
      if (parsed.length > 0 && !selectedProfileId) {
        onSelectProfile(parsed[0].id);
        onLoadProfile(parsed[0].measurements);
      }
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (profile: SavedProfile) => {
    onSelectProfile(profile.id);
    onLoadProfile(profile.measurements);
    toast.success(`Loaded "${profile.name}"`);
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
            pattern_type: 'skirt', // Default, but we won't filter by this
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
        measurements: data.measurements as unknown as UnifiedMeasurements,
        created_at: data.created_at,
      };

      setProfiles((prev) => [newProfile, ...prev]);
      onSelectProfile(newProfile.id);
      setSaveDialogOpen(false);
      setNewProfileName('');
      toast.success(`Profile "${newProfile.name}" saved!`);
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
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (profileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProfileToDelete(profileId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!profileToDelete) return;

    const profile = profiles.find((p) => p.id === profileToDelete);
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('saved_measurements')
        .delete()
        .eq('id', profileToDelete);

      if (error) throw error;

      const remaining = profiles.filter((p) => p.id !== profileToDelete);
      setProfiles(remaining);

      if (selectedProfileId === profileToDelete) {
        if (remaining.length > 0) {
          onSelectProfile(remaining[0].id);
          onLoadProfile(remaining[0].measurements);
        } else {
          onSelectProfile(null);
        }
      }

      setDeleteDialogOpen(false);
      setProfileToDelete(null);
      toast.success(`Profile "${profile.name}" deleted`);
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete profile');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Profiles</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSaveDialogOpen(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          New Profile
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : profiles.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            No saved profiles yet. Create your first profile to save your measurements.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSaveDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Profile
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="grid gap-2">
            {profiles.map((profile) => (
              <Card
                key={profile.id}
                className={cn(
                  "p-3 cursor-pointer transition-colors hover:bg-muted/50",
                  selectedProfileId === profile.id && "ring-2 ring-primary bg-primary/5"
                )}
                onClick={() => handleProfileClick(profile)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      selectedProfileId === profile.id 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    )}>
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{profile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={(e) => handleDeleteClick(profile.id, e)}
                    title="Delete profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Update button - visible when profile selected */}
          {selectedProfileId && (
            <Button
              variant="secondary"
              className="w-full gap-2"
              onClick={handleUpdateCurrent}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Update Profile with Current Measurements
            </Button>
          )}
        </div>
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
              {profiles.find((p) => p.id === profileToDelete)?.name}". This
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
