-- Create newsletter_subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'welcome_page',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to sign up (both authenticated and anonymous users)
CREATE POLICY "Anyone can subscribe to the newsletter"
ON public.newsletter_subscribers
FOR INSERT
WITH CHECK (true);

-- Add index for faster queries
CREATE INDEX idx_newsletter_subscribers_created_at ON public.newsletter_subscribers(created_at DESC);
