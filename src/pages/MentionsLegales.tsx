import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { LegalFooter } from '@/components/LegalFooter';

export default function MentionsLegales() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-3xl py-8 px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>

        <div className="prose prose-sm max-w-none text-foreground">
          <h1 className="font-serif text-3xl font-bold mb-2">Mentions Légales</h1>
          <p className="text-sm text-muted-foreground mb-8">Dernière mise à jour : Mai 2026</p>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">1. Éditeur du site</h2>
            <p className="text-muted-foreground mb-2">Le site studio.petitcitron.com est édité par :</p>
            <ul className="list-none space-y-1 text-muted-foreground pl-4">
              <li><span className="text-foreground font-medium">Nom :</span> Perrine Colignon</li>
              <li><span className="text-foreground font-medium">Activité :</span> Self-Employed (travailleur indépendant, Royaume-Uni)</li>
              <li><span className="text-foreground font-medium">Adresse :</span> 57 Clarewood Court, Crawford Street, London W1H 2NW, Royaume-Uni</li>
              <li><span className="text-foreground font-medium">Email :</span> <a href="mailto:contact@petitcitron.com" className="text-primary hover:underline">contact@petitcitron.com</a></li>
              <li><span className="text-foreground font-medium">Site principal :</span> <a href="https://www.petitcitron.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.petitcitron.com</a></li>
            </ul>
            <p className="text-muted-foreground mt-2">Directrice de la publication : Perrine Colignon</p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">2. Hébergeur</h2>
            <p className="text-muted-foreground mb-2">Le site studio.petitcitron.com est hébergé par :</p>
            <ul className="list-none space-y-1 text-muted-foreground pl-4">
              <li><span className="text-foreground font-medium">Cloudflare, Inc.</span></li>
              <li>101 Townsend St, San Francisco, CA 94107, États-Unis</li>
              <li><a href="https://www.cloudflare.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.cloudflare.com</a></li>
            </ul>
            <p className="text-muted-foreground mt-2">
              Le nom de domaine petitcitron.com est enregistré auprès de OVH SAS, 2 rue Kellermann, 59100 Roubaix, France.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">3. Propriété intellectuelle</h2>
            <p className="text-muted-foreground">
              L'ensemble des éléments constituant le site studio.petitcitron.com (textes, graphismes, logiciels, algorithmes de génération de patrons, logos, icônes, sons) sont la propriété exclusive de Perrine Colignon ou font l'objet d'une autorisation d'utilisation.
            </p>
            <p className="text-muted-foreground mt-2">
              Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, de ces éléments est interdite sans l'autorisation écrite préalable de Perrine Colignon.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">4. Limitation de responsabilité</h2>
            <p className="text-muted-foreground">
              Les patrons de couture générés par studio.petitcitron.com sont fournis à titre indicatif. Ils constituent des bases (blocs) sans marges de couture. Petit Citron ne saurait être tenu responsable des erreurs éventuelles dans les patrons générés, ni des résultats obtenus lors de leur utilisation.
            </p>
            <p className="text-muted-foreground mt-2">
              Petit Citron se réserve le droit de modifier, corriger ou interrompre le service à tout moment sans préavis.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">5. Droit applicable</h2>
            <p className="text-muted-foreground">
              Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
            </p>
          </section>
        </div>
      </div>
      <LegalFooter />
    </div>
  );
}
