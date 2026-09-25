-- Reconcile the checked-in constraint with what's already live in production:
-- 'unified' (shared body-measurement profiles, see ProfileManagerSimple/ProfileManager)
-- and 'pants-dartless'/'pants-with-darts' were added directly to the remote DB
-- without a migration file, so a fresh environment would reject them.
ALTER TABLE public.saved_measurements DROP CONSTRAINT IF EXISTS saved_measurements_pattern_type_check;

ALTER TABLE public.saved_measurements ADD CONSTRAINT saved_measurements_pattern_type_check
CHECK (pattern_type IN ('skirt', 'bodice', 'bodice-dartless', 'bodice-with-darts', 'bodice-knit', 'dress', 'pants', 'pants-dartless', 'pants-with-darts', 'sleeve', 'unified'));
