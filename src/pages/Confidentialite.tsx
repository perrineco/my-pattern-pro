import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { LegalFooter } from '@/components/LegalFooter';

export default function Confidentialite() {
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
          <h1 className="font-serif text-3xl font-bold mb-2">Politique de Confidentialité et Protection des Données</h1>
          <p className="text-sm text-muted-foreground mb-8">Dernière mise à jour : Mai 2026</p>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">1. Responsable du traitement</h2>
            <p className="text-muted-foreground">Perrine Colignon – Petit Citron Studio</p>
            <p className="text-muted-foreground">57 Clarewood Court, Crawford Street, London W1H 2NW, Royaume-Uni</p>
            <p className="text-muted-foreground">Email : <a href="mailto:contact@petitcitron.com" className="text-primary hover:underline">contact@petitcitron.com</a></p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">2. Données collectées</h2>
            <p className="text-muted-foreground mb-3">Lors de l'utilisation de studio.petitcitron.com, les données suivantes sont collectées :</p>

            <h3 className="font-medium text-foreground mb-2">Données d'identification et de compte :</h3>
            <ul className="list-none space-y-1 text-muted-foreground pl-4 mb-4">
              <li>Adresse email</li>
              <li>Mot de passe (stocké sous forme hachée, jamais en clair)</li>
              <li>Date et heure d'inscription</li>
            </ul>

            <h3 className="font-medium text-foreground mb-2">Données morphologiques (données personnelles à caractère sensible) :</h3>
            <p className="text-muted-foreground pl-4 mb-2">Mensurations corporelles saisies par l'utilisateur (tour de taille, tour de hanches, longueurs, etc.)</p>
            <p className="text-muted-foreground mb-4">
              Ces données morphologiques sont des données personnelles au sens du RGPD. Leur collecte est fondée sur le consentement explicite de l'utilisateur, recueilli lors de la création du compte.
            </p>

            <h3 className="font-medium text-foreground mb-2">Données de paiement :</h3>
            <ul className="list-none space-y-1 text-muted-foreground pl-4 mb-4">
              <li>Les données bancaires sont traitées exclusivement par Stripe (sous-traitant). Petit Citron Studio ne stocke aucune donnée bancaire.</li>
              <li>Historique des transactions (date, montant, type d'abonnement)</li>
            </ul>

            <h3 className="font-medium text-foreground mb-2">Données techniques :</h3>
            <ul className="list-none space-y-1 text-muted-foreground pl-4">
              <li>Adresse IP</li>
              <li>Type de navigateur et système d'exploitation</li>
              <li>Journaux d'accès (logs)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">3. Finalités du traitement</h2>
            <ul className="list-none space-y-1 text-muted-foreground pl-4">
              <li>Création et gestion du compte utilisateur</li>
              <li>Génération des patrons de couture sur mesure à partir des mensurations</li>
              <li>Gestion des abonnements et des paiements</li>
              <li>Envoi d'emails transactionnels (confirmation d'inscription, confirmation d'achat)</li>
              <li>Amélioration du service et statistiques d'utilisation anonymisées</li>
              <li>Réponse aux demandes de support client</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">4. Base légale des traitements</h2>
            <ul className="list-none space-y-2 text-muted-foreground pl-4">
              <li><span className="text-foreground font-medium">Exécution du contrat (art. 6.1.b RGPD) :</span> traitement des données nécessaire à la fourniture du service (génération des patrons, gestion de l'abonnement).</li>
              <li><span className="text-foreground font-medium">Consentement explicite (art. 6.1.a et 9.2.a RGPD) :</span> collecte des données morphologiques, recueillie lors de la création du compte avec case à cocher spécifique.</li>
              <li><span className="text-foreground font-medium">Intérêt légitime (art. 6.1.f RGPD) :</span> sécurité du service, prévention des fraudes, amélioration du service.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">5. Sous-traitants et destinataires des données</h2>
            <p className="text-muted-foreground mb-3">Petit Citron Studio fait appel aux sous-traitants suivants, conformément au RGPD :</p>
            <ul className="list-none space-y-2 text-muted-foreground pl-4">
              <li><span className="text-foreground font-medium">Supabase Inc.</span> (base de données et authentification) – San Francisco, CA, USA. Données hébergées en Europe (région eu-west). DPA disponible sur supabase.com.</li>
              <li><span className="text-foreground font-medium">Cloudflare, Inc.</span> (hébergement du frontend) – San Francisco, CA, USA. Certifié Privacy Shield / clauses contractuelles types.</li>
              <li><span className="text-foreground font-medium">Stripe, Inc.</span> (paiement) – San Francisco, CA, USA. Certifié PCI-DSS. DPA disponible sur stripe.com.</li>
            </ul>
            <p className="text-muted-foreground mt-3">Aucune donnée n'est vendue ou cédée à des tiers à des fins commerciales.</p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">6. Durée de conservation</h2>
            <ul className="list-none space-y-2 text-muted-foreground pl-4">
              <li><span className="text-foreground font-medium">Données de compte :</span> conservées pendant toute la durée de l'abonnement actif, puis 3 ans après la dernière activité (prescription légale).</li>
              <li><span className="text-foreground font-medium">Données morphologiques :</span> conservées pendant la durée d'activité du compte. Supprimées dans les 30 jours suivant la suppression du compte.</li>
              <li><span className="text-foreground font-medium">Données de paiement (historique) :</span> 10 ans conformément aux obligations comptables légales.</li>
              <li><span className="text-foreground font-medium">Logs techniques :</span> 12 mois maximum.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">7. Droits des utilisateurs</h2>
            <p className="text-muted-foreground mb-3">Conformément au RGPD (articles 15 à 22), tout utilisateur dispose des droits suivants :</p>
            <ul className="list-none space-y-2 text-muted-foreground pl-4">
              <li><span className="text-foreground font-medium">Droit d'accès :</span> obtenir une copie des données personnelles le concernant.</li>
              <li><span className="text-foreground font-medium">Droit de rectification :</span> corriger des données inexactes ou incomplètes.</li>
              <li><span className="text-foreground font-medium">Droit à l'effacement (« droit à l'oubli ») :</span> demander la suppression des données.</li>
              <li><span className="text-foreground font-medium">Droit à la portabilité :</span> recevoir ses données dans un format structuré et lisible par machine.</li>
              <li><span className="text-foreground font-medium">Droit d'opposition :</span> s'opposer à certains traitements fondés sur l'intérêt légitime.</li>
              <li><span className="text-foreground font-medium">Droit de retrait du consentement :</span> retirer à tout moment le consentement donné pour les données morphologiques, sans que cela affecte la licéité des traitements antérieurs.</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Pour exercer ces droits : <a href="mailto:contact@petitcitron.com" className="text-primary hover:underline">contact@petitcitron.com</a>. Réponse sous 30 jours.
            </p>
            <p className="text-muted-foreground mt-2">
              En cas de réclamation non résolue, l'utilisateur peut saisir la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CNIL</a> ou l'autorité de protection des données compétente dans son pays de résidence.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">8. Sécurité des données</h2>
            <p className="text-muted-foreground mb-2">Petit Citron Studio met en œuvre les mesures techniques et organisationnelles suivantes :</p>
            <ul className="list-none space-y-1 text-muted-foreground pl-4">
              <li>Chiffrement des communications par protocole TLS/HTTPS</li>
              <li>Mots de passe stockés sous forme hachée (bcrypt via Supabase Auth)</li>
              <li>Accès aux données restreint au personnel autorisé</li>
              <li>Base de données hébergée dans une région européenne (Supabase EU)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">9. Cookies</h2>
            <p className="text-muted-foreground">
              Studio.petitcitron.com utilise des cookies strictement nécessaires au fonctionnement du service (session d'authentification). Ces cookies ne nécessitent pas de consentement préalable.
            </p>
            <p className="text-muted-foreground mt-2">
              Si des cookies analytics (Google Analytics ou équivalent) sont activés, une bannière de consentement sera affichée conformément aux recommandations de la CNIL.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-3">10. Modifications de la politique de confidentialité</h2>
            <p className="text-muted-foreground">
              Petit Citron Studio se réserve le droit de modifier la présente politique à tout moment. Les utilisateurs seront informés par email de toute modification substantielle. La version en vigueur est celle publiée sur le site à la date de consultation.
            </p>
          </section>
        </div>
      </div>
      <LegalFooter />
    </div>
  );
}
