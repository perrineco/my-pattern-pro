-- Drop the old pattern_type check constraint and add a new one with all variants
ALTER TABLE public.saved_measurements DROP CONSTRAINT IF EXISTS saved_measurements_pattern_type_check;

ALTER TABLE public.saved_measurements ADD CONSTRAINT saved_measurements_pattern_type_check 
CHECK (pattern_type IN ('skirt', 'bodice', 'bodice-dartless', 'bodice-with-darts', 'bodice-knit', 'dress', 'pants', 'sleeve'));