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
   name: z.string().trim().min(1, 'Le nom est requis').max(100, 'Le nom doit faire moins de 100 caractères'),
   email: z.string().trim().email('Veuillez entrer une adresse email valide').max(255, "L'email doit faire moins de 255 caractères"),
   category: z.enum(['question', 'bug_report', 'feature_request', 'other'], {
     required_error: 'Veuillez sélectionner une catégorie',
   }),
   message: z.string().trim().min(10, 'Le message doit faire au moins 10 caractères').max(2000, 'Le message doit faire moins de 2000 caractères'),
 });

 type ContactFormData = z.infer<typeof contactSchema>;

 const categories = [
   { value: 'question', label: 'Question', icon: HelpCircle, description: "Poser une question sur l'app" },
   { value: 'bug_report', label: 'Signaler un bug', icon: Bug, description: 'Signaler un problème ou une erreur' },
   { value: 'feature_request', label: 'Suggestion', icon: Lightbulb, description: 'Proposer une amélioration' },
   { value: 'other', label: 'Autre', icon: MessageSquare, description: 'Retour général' },
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
       
       toast.success('Merci pour votre message !', {
         description: 'Nous vous répondrons dans les plus brefs délais.',
       });

       reset();
     } catch (error) {
       console.error('Error submitting contact form:', error);
       toast.error("Échec de l'envoi", {
         description: 'Veuillez réessayer plus tard.',
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
           Retour
         </Button>

         <Card>
           <CardHeader className="text-center">
             <CardTitle className="font-serif text-2xl">Nous contacter</CardTitle>
             <CardDescription>
               Une question, un bug, une suggestion ? Nous serions ravis de vous lire !
             </CardDescription>
           </CardHeader>

           <CardContent>
             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
               {/* Nom */}
               <div className="space-y-2">
                 <Label htmlFor="name">Nom</Label>
                 <Input
                   id="name"
                   placeholder="Votre nom"
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
                   placeholder="votre@email.com"
                   {...register('email')}
                   className={errors.email ? 'border-destructive' : ''}
                 />
                 {errors.email && (
                   <p className="text-sm text-destructive">{errors.email.message}</p>
                 )}
               </div>
               
               {/* Catégorie */}
               <div className="space-y-2">
                 <Label>Catégorie</Label>
                 <Select
                   value={selectedCategory}
                   onValueChange={(value) => setValue('category', value as ContactFormData['category'])}
                 >
                   <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                     <SelectValue placeholder="Sélectionner une catégorie" />
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
                   placeholder="Dites-nous en plus..."
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
                 {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
               </Button>
             </form>
           </CardContent>
         </Card>
       </div>
     </div>
   );
 }