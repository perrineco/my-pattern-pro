import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { LegalFooter } from '@/components/LegalFooter';

export default function CGV() {
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
          <h1 className="font-serif text-3xl font-bold mb-2">Conditions Générales de Vente</h1>
          <p className="text-sm text-muted-foreground mb-8">Dernière mise à jour : Mai 2026</p>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">1. Objet et champ d'application</h2>
            <p className="text-muted-foreground">
              Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre Perrine Colignon, exploitant le service Petit Citron Studio (ci-après « le Vendeur »), et toute personne physique ou morale effectuant un achat sur studio.petitcitron.com (ci-après « le Client »).
            </p>
            <p className="text-muted-foreground mt-2">
              Tout achat implique l'acceptation pleine et entière des présentes CGV.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">2. Identité du vendeur</h2>
            <ul className="list-none space-y-1 text-muted-foreground pl-4">
              <li>Perrine Colignon – Self-Employed, Royaume-Uni</li>
              <li>57 Clarewood Court, Crawford Street, London W1H 2NW, UK</li>
              <li>Email : <a href="mailto:contact@petitcitron.com" className="text-primary hover:underline">contact@petitcitron.com</a></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">3. Description des produits et services</h2>
            <p className="text-muted-foreground mb-2">Petit Citron Studio propose les offres suivantes :</p>
            <ul className="list-none space-y-1 text-muted-foreground pl-4">
              <li><span className="text-foreground font-medium">Patron unique (4,99 € TTC) :</span> accès à vie à un type de patron sur mesure, téléchargement PDF inclus.</li>
              <li><span className="text-foreground font-medium">Abonnement Basique (9,99 € TTC/mois) :</span> génération de 5 patrons par mois, tous types disponibles.</li>
              <li><span className="text-foreground font-medium">Abonnement Pro (19,99 € TTC/mois) :</span> génération illimitée de patrons, tous types disponibles.</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Les patrons générés sont des blocs de base (slopers) sans marges de couture. Cette caractéristique est explicitement indiquée lors de chaque génération. Le Client est responsable de l'ajout des marges de couture avant utilisation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">4. Prix</h2>
            <p className="text-muted-foreground">
              Tous les prix sont indiqués en euros (€) toutes taxes comprises (TTC). Le Vendeur se réserve le droit de modifier ses tarifs à tout moment. Les prix applicables sont ceux en vigueur au moment de la commande.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">5. Modalités de paiement</h2>
            <p className="text-muted-foreground">
              Le paiement s'effectue en ligne par carte bancaire (Visa, Mastercard, Carte Bleue) via la plateforme sécurisée Stripe. Aucune donnée bancaire n'est stockée par Petit Citron Studio. Les transactions sont sécurisées par le protocole SSL/TLS.
            </p>
            <p className="text-muted-foreground mt-2">
              Pour les abonnements, le prélèvement est automatique à chaque échéance mensuelle à la date anniversaire de la souscription.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">6. Droit de rétractation</h2>
            <p className="text-muted-foreground">
              Conformément à l'article L.221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contenus numériques dont l'exécution a commencé avec l'accord préalable et exprès du consommateur, qui a reconnu perdre son droit de rétractation.
            </p>
            <p className="text-muted-foreground mt-2">
              En procédant au téléchargement d'un patron ou à la génération d'un patron sur mesure, le Client reconnaît expressément renoncer à son droit de rétractation de 14 jours.
            </p>
            <p className="text-muted-foreground mt-2">
              Cette renonciation est recueillie lors du processus de commande, avant validation définitive.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">7. Résiliation des abonnements</h2>
            <p className="text-muted-foreground">
              Le Client peut résilier son abonnement à tout moment depuis son espace personnel (menu « Gérer l'abonnement »). La résiliation prend effet à la fin de la période en cours, déjà payée. Aucun remboursement prorata temporis ne sera effectué pour la période en cours.
            </p>
            <p className="text-muted-foreground mt-2">
              Petit Citron Studio se réserve le droit de résilier un abonnement en cas de non-paiement ou d'utilisation abusive du service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">8. Remboursements exceptionnels</h2>
            <p className="text-muted-foreground">
              En dehors du droit de rétractation non applicable (voir article 6), tout remboursement exceptionnel est laissé à la discrétion de Petit Citron Studio. En cas d'anomalie technique avérée empêchant l'accès au service, le Client peut contacter le support via le formulaire de contact dans un délai de 30 jours.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">9. Disponibilité du service</h2>
            <p className="text-muted-foreground">
              Petit Citron Studio s'efforce d'assurer la disponibilité du service 24h/24 et 7j/7. Des interruptions peuvent survenir pour des raisons de maintenance ou de force majeure. Aucune compensation ne sera due pour ces interruptions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">10. Droit applicable et juridiction compétente</h2>
            <p className="text-muted-foreground">
              Les présentes CGV sont soumises au droit français. En cas de litige non résolu amiablement, les tribunaux français seront seuls compétents.
            </p>
            <p className="text-muted-foreground mt-2">
              Conformément aux articles L.611-1 et suivants du Code de la consommation, le Client consommateur peut recourir à la médiation conventionnelle ou à tout autre mode alternatif de règlement des différends en cas de litige.
            </p>
          </section>
        </div>
      </div>
      <LegalFooter />
    </div>
  );
}
