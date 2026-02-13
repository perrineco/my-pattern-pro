import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Labels
  'label.category': { en: 'Category', fr: 'Catégorie' },
  'label.units': { en: 'Units', fr: 'Unités' },
  'label.garmentType': { en: 'Garment Type', fr: 'Type de vêtement' },
  'label.measurements': { en: 'Measurements', fr: 'Mesures' },
  'label.profile': { en: 'Profile', fr: 'Profil' },

  // Categories
  'category.women': { en: 'Women', fr: 'Femmes' },
  'category.men': { en: 'Men', fr: 'Hommes' },
  'category.kids': { en: 'Kids', fr: 'Enfants' },

  // Pattern types (nav buttons)
  'pattern.skirt': { en: 'Skirt', fr: 'Jupe' },
  'pattern.bodice': { en: 'Bodice', fr: 'Corsage' },
  'pattern.dress': { en: 'Dress', fr: 'Robe' },
  'pattern.pants': { en: 'Pants', fr: 'Pantalon' },
  'pattern.sleeve': { en: 'Sleeve', fr: 'Manche' },
  'pattern.dartless': { en: 'Dartless', fr: 'Sans pinces' },
  'pattern.withDarts': { en: 'With Darts', fr: 'Avec pinces' },
  'pattern.forKnit': { en: 'For Knit', fr: 'Pour maille' },

  // Pattern preview titles
  'title.basicSkirt': { en: 'Basic Skirt', fr: 'Jupe de base' },
  'title.basicBodice': { en: 'Basic Bodice', fr: 'Corsage de base' },
  'title.dartlessBodice': { en: 'Dartless Bodice', fr: 'Corsage sans pinces' },
  'title.bodiceWithDarts': { en: 'Bodice with Darts', fr: 'Corsage avec pinces' },
  'title.knitBodice': { en: 'Knit Bodice', fr: 'Corsage maille' },
  'title.basicPants': { en: 'Basic Pants', fr: 'Pantalon de base' },
  'title.basicSleeve': { en: 'Basic Sleeve', fr: 'Manche de base' },
  'title.patternPreview': { en: 'Pattern Preview', fr: 'Aperçu du patron' },

  // Measurement labels - Skirt
  'meas.waistCircumference': { en: 'Waist Circumference', fr: 'Tour de taille' },
  'meas.hipCircumference': { en: 'Hip Circumference', fr: 'Tour de hanches' },
  'meas.waistToHip': { en: 'Waist to Hip', fr: 'Taille aux hanches' },
  'meas.skirtLength': { en: 'Skirt Length', fr: 'Longueur de jupe' },

  // Measurement labels - Bodice
  'meas.bust': { en: 'Bust', fr: 'Poitrine' },
  'meas.bustCircumference': { en: 'Bust Circumference', fr: 'Tour de poitrine' },
  'meas.necklineCircumference': { en: 'Neckline Circumference', fr: 'Tour de cou' },
  'meas.neckCircumference': { en: 'Neck Circumference', fr: 'Tour de cou' },
  'meas.shoulderLength': { en: 'Shoulder Length', fr: 'Longueur d\'épaule' },
  'meas.backWidth': { en: 'Back Width', fr: 'Carrure dos' },
  'meas.backWidthCarrure': { en: 'Back Width (Carrure dos)', fr: 'Carrure dos' },
  'meas.backLength': { en: 'Back Length', fr: 'Longueur taille-dos' },
  'meas.backLengthLongueur': { en: 'Back Length (Longueur taille-dos)', fr: 'Longueur taille-dos' },

  // Measurement labels - Pants
  'meas.waist': { en: 'Waist', fr: 'Taille' },
  'meas.hip': { en: 'Hip', fr: 'Hanches' },
  'meas.thigh': { en: 'Thigh', fr: 'Cuisse' },
  'meas.knee': { en: 'Knee', fr: 'Genou' },
  'meas.ankle': { en: 'Ankle', fr: 'Cheville' },
  'meas.crotchDepth': { en: 'Crotch Depth (Rise)', fr: 'Hauteur d\'entrejambe (montant)' },
  'meas.outseamLength': { en: 'Outseam Length', fr: 'Longueur extérieure' },
  'meas.inseamLength': { en: 'Inseam Length', fr: 'Longueur intérieure (entrejambe)' },

  // Measurement labels - Sleeve
  'meas.upperArm': { en: 'Upper Arm', fr: 'Tour de bras' },
  'meas.wrist': { en: 'Wrist', fr: 'Tour de poignet' },
  'meas.sleeveLength': { en: 'Sleeve Length', fr: 'Longueur de manche' },
  'meas.elbowLength': { en: 'Elbow Length', fr: 'Longueur coude' },
  'meas.armholeDepth': { en: 'Armhole Depth', fr: 'Profondeur d\'emmanchure' },

  // Measurement labels - Common
  'meas.ease': { en: 'Ease', fr: 'Aisance' },

  // Measurement hints - Skirt
  'hint.measureAtNaturalWaist': { en: 'Measure at natural waist', fr: 'Mesurer à la taille naturelle' },
  'hint.measureAtFullestPart': { en: 'Measure at fullest part', fr: 'Mesurer à l\'endroit le plus large' },
  'hint.distanceBetweenWaistAndHip': { en: 'Distance between waist and hip', fr: 'Distance entre la taille et les hanches' },
  'hint.fromWaistToHem': { en: 'From waist to hem', fr: 'De la taille à l\'ourlet' },
  'hint.wearingEaseAllowance': { en: 'Wearing ease allowance', fr: 'Tolérance d\'aisance' },

  // Measurement hints - Bodice
  'hint.tourDePoitrine': { en: 'Full bust circumference', fr: 'Tour de poitrine' },
  'hint.tourDeCou': { en: 'Around base of neck', fr: 'Tour de cou' },
  'hint.longueurEpaule': { en: 'From neck point to shoulder tip', fr: 'Du point de cou à la pointe d\'épaule' },
  'hint.carrureDos': { en: 'Across back between armholes', fr: 'Carrure dos entre les emmanchures' },
  'hint.longueurTailleDos': { en: 'From neck base to waist', fr: 'De la base du cou à la taille' },
  'hint.addedWearingRoom': { en: 'Added wearing room', fr: 'Aisance de confort' },

  // Measurement hints - Pants
  'hint.measureFullestThigh': { en: 'Measure at fullest part of thigh', fr: 'Mesurer à l\'endroit le plus large de la cuisse' },
  'hint.measureAroundKnee': { en: 'Measure around the knee', fr: 'Mesurer autour du genou' },
  'hint.measureAroundAnkle': { en: 'Measure around the ankle', fr: 'Mesurer autour de la cheville' },
  'hint.waistToSeat': { en: 'Waist to seat while sitting', fr: 'Taille à l\'assise en position assise' },
  'hint.waistToFloor': { en: 'Waist to floor along outside leg', fr: 'Taille au sol le long de la jambe extérieure' },
  'hint.crotchToFloor': { en: 'Crotch to floor along inside leg', fr: 'Entrejambe au sol le long de la jambe intérieure' },

  // Measurement hints - Knit
  'hint.knitEase': { en: 'Knit ease (0 = body-hugging, negative = compression)', fr: 'Aisance maille (0 = près du corps, négatif = compression)' },

  // Section headers
  'section.circumferences': { en: 'Circumferences', fr: 'Circonférences' },
  'section.lengths': { en: 'Lengths', fr: 'Longueurs' },
  'section.core': { en: 'Core', fr: 'Principales' },
  'section.widthLength': { en: 'Width & Length', fr: 'Largeur & Longueur' },
  'section.forKnitFabrics': { en: 'For Knit Fabrics', fr: 'Pour tissus maille' },

  // Footer notes
  'note.allMeasurementsIn': { en: 'All measurements in', fr: 'Toutes les mesures en' },
  'note.centimeters': { en: 'centimeters', fr: 'centimètres' },
  'note.inches': { en: 'inches', fr: 'pouces' },
  'note.standardEase': { en: 'The pattern includes standard ease allowances.', fr: 'Le patron inclut les marges d\'aisance standard.' },
  'note.optimizedKnit': { en: 'Optimized for stretch knit fabrics.', fr: 'Optimisé pour les tissus maille extensibles.' },
  'note.simpleBodice': { en: 'Simple bodice block without bust darts', fr: 'Corsage de base sans pinces de poitrine' },

   // Buttons & actions
   'action.reset': { en: 'Reset', fr: 'Réinitialiser' },
   'action.exportPdf': { en: 'Export PDF', fr: 'Exporter PDF' },
   'action.print': { en: 'Print', fr: 'Imprimer' },
   'action.howToMeasure': { en: 'How to measure', fr: 'Comment mesurer' },
  'action.signIn': { en: 'Sign In', fr: 'Connexion' },
  'action.signOut': { en: 'Sign Out', fr: 'Déconnexion' },
  'action.plans': { en: 'Plans', fr: 'Abonnements' },
  'action.adjustments': { en: 'Adjustments', fr: 'Ajustements' },
  'action.pricing': { en: 'Pricing', fr: 'Tarifs' },
  'action.contact': { en: 'Contact', fr: 'Contact' },
  'action.viewPlans': { en: 'View Plans', fr: 'Voir les abonnements' },
  'action.manageProfiles': { en: 'Manage Profiles', fr: 'Gérer les profils' },
  'action.manageSubscription': { en: 'Manage Subscription', fr: 'Gérer l\'abonnement' },
  'action.contactUs': { en: 'Contact Us', fr: 'Nous contacter' },
  'action.backToPatterns': { en: 'Back to Patterns', fr: 'Retour aux patrons' },
  'action.saveAsNew': { en: 'Save as new profile', fr: 'Sauvegarder comme nouveau profil' },
  'action.deleteProfile': { en: 'Delete profile', fr: 'Supprimer le profil' },
  'action.updateCurrentProfile': { en: 'Update Current Profile', fr: 'Mettre à jour le profil actuel' },
  'action.cancel': { en: 'Cancel', fr: 'Annuler' },
  'action.saveProfile': { en: 'Save Profile', fr: 'Sauvegarder le profil' },
  'action.delete': { en: 'Delete', fr: 'Supprimer' },

  // Profile manager
  'profile.loading': { en: 'Loading...', fr: 'Chargement...' },
  'profile.noSavedProfiles': { en: 'No saved profiles', fr: 'Aucun profil sauvegardé' },
  'profile.selectProfile': { en: 'Select profile', fr: 'Sélectionner un profil' },
  'profile.saveNewTitle': { en: 'Save New Profile', fr: 'Sauvegarder un nouveau profil' },
  'profile.namePlaceholder': { en: "Profile name (e.g., 'My measurements', 'Client A')", fr: "Nom du profil (ex: 'Mes mesures', 'Client A')" },
  'profile.deleteTitle': { en: 'Delete Profile?', fr: 'Supprimer le profil ?' },
  'profile.deleteDescription': { en: 'This will permanently delete', fr: 'Ceci supprimera définitivement' },
  'profile.cannotBeUndone': { en: 'This action cannot be undone.', fr: 'Cette action est irréversible.' },

   // Guides
   'guide.measurementGuide': { en: 'Measurement Guide', fr: 'Guide de mesure' },
   'guide.sleeveMeasurementGuide': { en: 'Sleeve Measurement Guide', fr: 'Guide de mesure pour manches' },
   'guide.bodiceGuide': { en: 'Bodice Measurement Guide', fr: 'Guide de mesure pour corsage' },
   'guide.tipsForAccurate': { en: 'Tips for accurate measurements', fr: 'Conseils pour des mesures précises' },
   'guide.waist': { en: 'Waist', fr: 'Taille' },
   'guide.hip': { en: 'Hip', fr: 'Hanches' },
   'guide.waistToHip': { en: 'Waist to Hip', fr: 'Taille aux hanches' },
   'guide.skirtLength': { en: 'Skirt Length', fr: 'Longueur de jupe' },
   'guide.upperArm': { en: 'Upper Arm', fr: 'Tour de bras' },
   'guide.wrist': { en: 'Wrist', fr: 'Poignet' },
   'guide.sleeveLength': { en: 'Sleeve Length', fr: 'Longueur de manche' },
   'guide.elbowLength': { en: 'Elbow Length', fr: 'Longueur coude' },
   'guide.armholeDepth': { en: 'Armhole Depth', fr: 'Profondeur d\'emmanchure' },
   'guide.shoulderPoint': { en: 'Shoulder point', fr: 'Pointe d\'épaule' },
   'guide.elbow': { en: 'Elbow', fr: 'Coude' },

   // Misc
   'misc.soon': { en: 'Soon', fr: 'Bientôt' },
   'misc.free': { en: 'Free', fr: 'Gratuit' },
  'misc.plan': { en: 'plan', fr: 'plan' },
  'misc.createPatterns': { en: 'Create your custom sewing patterns', fr: 'Créez vos patrons de couture sur mesure' },
  'misc.signInPrompt': { en: 'Sign in to save your measurements and access all pattern types.', fr: 'Connectez-vous pour sauvegarder vos mesures et accéder à tous les types de patrons.' },
  'misc.upgradePrompt': { en: 'Upgrade to access dress, pants, and sleeve patterns.', fr: 'Passez à un abonnement supérieur pour accéder aux patrons de robe, pantalon et manche.' },
  'misc.language': { en: 'Language', fr: 'Langue' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'fr') ? saved : 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
