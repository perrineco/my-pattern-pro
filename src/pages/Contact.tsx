 import { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { useForm } from 'react-hook-form';
 import { zodResolver } from '@hookform/resolvers/zod';
 import { z } from 'zod';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from '@/contexts/AuthContext';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Textarea } from '@/components/ui/textarea';
 import { Label } from '@/components/ui/label';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { toast } from 'sonner';
 import { ArrowLeft, Send, MessageSquare, Bug, Lightbulb, HelpCircle } from 'lucide-react';
 
 const contactSchema = z.object({
   name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
   email: z.string().trim().email('Please enter a valid email address').max(255, 'Email must be less than 255 characters'),
   category: z.enum(['question', 'bug_report', 'feature_request', 'other'], {
     required_error: 'Please select a category',
   }),
   message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be less than 2000 characters'),
 });
 
 type ContactFormData = z.infer<typeof contactSchema>;
 
 const categories = [
   { value: 'question', label: 'Question', icon: HelpCircle, description: 'Ask about using the app' },
   { value: 'bug_report', label: 'Bug Report', icon: Bug, description: 'Report an issue or error' },
   { value: 'feature_request', label: 'Feature Request', icon: Lightbulb, description: 'Suggest an improvement' },
   { value: 'other', label: 'Other', icon: MessageSquare, description: 'General feedback' },
 ];
 
 export default function Contact() {
   const navigate = useNavigate();
   const { user } = useAuth();
   const [isSubmitting, setIsSubmitting] = useState(false);
   
   const {
     register,
     handleSubmit,
     setValue,
     watch,
     reset,
     formState: { errors },
   } = useForm<ContactFormData>({
     resolver: zodResolver(contactSchema),
     defaultValues: {
       name: '',
       email: user?.email || '',
       message: '',
     },
   });
   
   const selectedCategory = watch('category');
   
   const onSubmit = async (data: ContactFormData) => {
     setIsSubmitting(true);
     
     try {
       const { error } = await supabase.from('contact_submissions').insert({
         user_id: user?.id || null,
         name: data.name,
         email: data.email,
         category: data.category,
         message: data.message,
       });
       
       if (error) throw error;
       
       toast.success('Thank you for your message!', {
         description: 'We\'ll get back to you as soon as possible.',
       });
       
       reset();
     } catch (error) {
       console.error('Error submitting contact form:', error);
       toast.error('Failed to send message', {
         description: 'Please try again later.',
       });
     } finally {
       setIsSubmitting(false);
     }
   };
   
   return (
     <div className="min-h-screen bg-background">
       <div className="container max-w-2xl py-8 px-4">
         <Button
           variant="ghost"
           onClick={() => navigate('/')}
           className="mb-6 gap-2"
         >
           <ArrowLeft className="w-4 h-4" />
           Back to Sloper
         </Button>
         
         <Card>
           <CardHeader className="text-center">
             <CardTitle className="font-serif text-2xl">Contact Us</CardTitle>
             <CardDescription>
               Have a question, found a bug, or want to suggest a feature? We'd love to hear from you!
             </CardDescription>
           </CardHeader>
           
           <CardContent>
             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
               {/* Name */}
               <div className="space-y-2">
                 <Label htmlFor="name">Name</Label>
                 <Input
                   id="name"
                   placeholder="Your name"
                   {...register('name')}
                   className={errors.name ? 'border-destructive' : ''}
                 />
                 {errors.name && (
                   <p className="text-sm text-destructive">{errors.name.message}</p>
                 )}
               </div>
               
               {/* Email */}
               <div className="space-y-2">
                 <Label htmlFor="email">Email</Label>
                 <Input
                   id="email"
                   type="email"
                   placeholder="your@email.com"
                   {...register('email')}
                   className={errors.email ? 'border-destructive' : ''}
                 />
                 {errors.email && (
                   <p className="text-sm text-destructive">{errors.email.message}</p>
                 )}
               </div>
               
               {/* Category */}
               <div className="space-y-2">
                 <Label>Category</Label>
                 <Select
                   value={selectedCategory}
                   onValueChange={(value) => setValue('category', value as ContactFormData['category'])}
                 >
                   <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                     <SelectValue placeholder="Select a category" />
                   </SelectTrigger>
                   <SelectContent>
                     {categories.map((cat) => {
                       const Icon = cat.icon;
                       return (
                         <SelectItem key={cat.value} value={cat.value}>
                           <div className="flex items-center gap-2">
                             <Icon className="w-4 h-4 text-muted-foreground" />
                             <span>{cat.label}</span>
                           </div>
                         </SelectItem>
                       );
                     })}
                   </SelectContent>
                 </Select>
                 {errors.category && (
                   <p className="text-sm text-destructive">{errors.category.message}</p>
                 )}
               </div>
               
               {/* Message */}
               <div className="space-y-2">
                 <Label htmlFor="message">Message</Label>
                 <Textarea
                   id="message"
                   placeholder="Tell us more..."
                   rows={5}
                   {...register('message')}
                   className={errors.message ? 'border-destructive' : ''}
                 />
                 {errors.message && (
                   <p className="text-sm text-destructive">{errors.message.message}</p>
                 )}
                 <p className="text-xs text-muted-foreground text-right">
                   {watch('message')?.length || 0}/2000
                 </p>
               </div>
               
               <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                 <Send className="w-4 h-4" />
                 {isSubmitting ? 'Sending...' : 'Send Message'}
               </Button>
             </form>
           </CardContent>
         </Card>
       </div>
     </div>
   );
 }