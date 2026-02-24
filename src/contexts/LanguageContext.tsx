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
  // Unified form hints
  'hint.waist': { en: 'Measure at natural waist', fr: 'Mesurer à la taille naturelle' },
  'hint.hip': { en: 'Measure at fullest part', fr: 'Mesurer à l\'endroit le plus large' },
  'hint.bust': { en: 'Full bust circumference', fr: 'Tour de poitrine' },
  'hint.neckCircumference': { en: 'Around base of neck', fr: 'Tour de cou' },
  'hint.shoulderLength': { en: 'From neck point to shoulder tip', fr: 'Du point de cou à la pointe d\'épaule' },
  'hint.backWidth': { en: 'Across back between armholes', fr: 'Carrure dos entre les emmanchures' },
  'hint.backLength': { en: 'From neck base to waist', fr: 'De la base du cou à la taille' },
  'hint.waistToHip': { en: 'Distance between waist and hip', fr: 'Distance entre la taille et les hanches' },
  'hint.skirtLength': { en: 'From waist to hem', fr: 'De la taille à l\'ourlet' },
  // Unified hints - Pants
  'hint.thigh': { en: 'Measure at fullest part of thigh', fr: 'Mesurer à l\'endroit le plus large de la cuisse' },
  'hint.knee': { en: 'Measure around the knee', fr: 'Mesurer autour du genou' },
  'hint.ankle': { en: 'Measure around the ankle', fr: 'Mesurer autour de la cheville' },
  'hint.crotchDepth': { en: 'Waist to seat while sitting', fr: 'Taille à l\'assise en position assise' },
  'hint.outseamLength': { en: 'Waist to floor along outside leg', fr: 'Taille au sol le long de la jambe extérieure' },
  'hint.inseamLength': { en: 'Crotch to floor along inside leg', fr: 'Entrejambe au sol le long de la jambe intérieure' },
  // Unified hints - Sleeve
  'hint.upperArm': { en: 'Measure around bicep at fullest point', fr: 'Mesurer autour du biceps au point le plus large' },
  'hint.wrist': { en: 'Measure around the wrist', fr: 'Mesurer autour du poignet' },
  'hint.sleeveLength': { en: 'Shoulder to wrist', fr: 'De l\'épaule au poignet' },
  'hint.elbowLength': { en: 'Shoulder to elbow', fr: 'De l\'épaule au coude' },
  'hint.armholeDepth': { en: 'Sleeve cap height', fr: 'Hauteur de tête de manche' },

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
  'profile.noSavedDesc': { en: 'No saved profiles yet. Create your first profile to save your measurements.', fr: 'Aucun profil sauvegardé. Créez votre premier profil pour enregistrer vos mesures.' },
  'profile.selectProfile': { en: 'Select profile', fr: 'Sélectionner un profil' },
  'profile.saveNewTitle': { en: 'Save New Profile', fr: 'Nouveau profil' },
  'profile.namePlaceholder': { en: "Profile name (e.g., 'My measurements', 'Client A')", fr: "Nom du profil (ex: 'Mes mesures', 'Client A')" },
  'profile.deleteTitle': { en: 'Delete Profile?', fr: 'Supprimer le profil ?' },
  'profile.deleteDescription': { en: 'This will permanently delete', fr: 'Ceci supprimera définitivement' },
  'profile.cannotBeUndone': { en: 'This action cannot be undone.', fr: 'Cette action est irréversible.' },
  'profile.profiles': { en: 'Profiles', fr: 'Profils' },
  'profile.newProfile': { en: 'New Profile', fr: 'Nouveau profil' },
  'profile.createProfile': { en: 'Create Profile', fr: 'Créer un profil' },
  'profile.updateWithCurrent': { en: 'Update Profile with Current Measurements', fr: 'Mettre à jour le profil avec les mesures actuelles' },
  'profile.manageTitle': { en: 'Manage Profiles', fr: 'Gérer les profils' },
  'profile.manageDesc': { en: 'Save and manage your measurement profiles', fr: 'Sauvegardez et gérez vos profils de mesures' },
  'profile.loaded': { en: 'Loaded', fr: 'Chargé' },
  'profile.saved': { en: 'saved!', fr: 'sauvegardé !' },
  'profile.updated': { en: 'updated!', fr: 'mis à jour !' },
  'profile.deleted': { en: 'deleted', fr: 'supprimé' },
  'profile.failedSave': { en: 'Failed to save profile', fr: 'Échec de la sauvegarde du profil' },
  'profile.failedUpdate': { en: 'Failed to update profile', fr: 'Échec de la mise à jour du profil' },
  'profile.failedDelete': { en: 'Failed to delete profile', fr: 'Échec de la suppression du profil' },
  'profile.enterName': { en: 'Please enter a profile name', fr: 'Veuillez entrer un nom de profil' },

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
   'guide.bust': { en: 'Bust', fr: 'Tour de poitrine' },
   'guide.neckline': { en: 'Neckline Circumference', fr: 'Tour de cou' },
   'guide.shoulderLength': { en: 'Shoulder Length', fr: 'Longueur d\'épaule' },
   'guide.backWidth': { en: 'Back Width', fr: 'Carrure dos' },
   'guide.backLength': { en: 'Back Length', fr: 'Longueur taille-dos' },

   // Guide descriptions - Skirt
   'guide.desc.waist': { en: 'Measure around your natural waistline—the narrowest part of your torso, typically about 2.5cm above your belly button. Keep the tape snug but not tight.', fr: 'Mesurez autour de votre taille naturelle — la partie la plus étroite du torse, généralement environ 2,5 cm au-dessus du nombril. Le ruban doit être ajusté mais pas serré.' },
   'guide.desc.hip': { en: 'Measure around the fullest part of your hips and buttocks. Stand with feet together and keep the tape level all the way around.', fr: 'Mesurez autour de la partie la plus large des hanches et des fesses. Tenez-vous debout, pieds joints, et gardez le ruban bien horizontal.' },
   'guide.desc.waistToHip': { en: 'Measure straight down from your natural waistline to the fullest part of your hip. This is typically 18-23cm for adults.', fr: 'Mesurez en ligne droite de la taille naturelle jusqu\'à la partie la plus large des hanches. C\'est généralement 18 à 23 cm pour les adultes.' },
   'guide.desc.skirtLength': { en: 'Measure from your natural waistline down to where you want the skirt to end. Stand straight and have someone help for accuracy.', fr: 'Mesurez de la taille naturelle jusqu\'à l\'endroit où vous souhaitez que la jupe s\'arrête. Restez debout et faites-vous aider pour plus de précision.' },

   // Guide descriptions - Sleeve
   'guide.desc.upperArm': { en: 'Measure around the fullest part of your upper arm (bicep). Keep the tape snug but not tight, with your arm relaxed at your side.', fr: 'Mesurez autour de la partie la plus large du bras (biceps). Le ruban doit être ajusté mais pas serré, bras détendu le long du corps.' },
   'guide.desc.wrist': { en: 'Measure around your wrist bone. Keep the tape comfortably snug, allowing for natural movement.', fr: 'Mesurez autour de l\'os du poignet. Le ruban doit être confortable, permettant un mouvement naturel.' },
   'guide.desc.sleeveLength': { en: 'Measure from the shoulder point (where shoulder meets arm) straight down to the wrist bone. Keep your arm slightly bent.', fr: 'Mesurez de la pointe d\'épaule (où l\'épaule rejoint le bras) jusqu\'à l\'os du poignet. Gardez le bras légèrement fléchi.' },
   'guide.desc.elbowLength': { en: 'Measure from the shoulder point down to the elbow. Bend your arm slightly to locate the elbow point accurately.', fr: 'Mesurez de la pointe d\'épaule jusqu\'au coude. Pliez légèrement le bras pour localiser le coude avec précision.' },
   'guide.desc.armholeDepth': { en: 'This is the sleeve cap height. Measure from shoulder point to underarm level (approximately 2-3cm below the armpit).', fr: 'C\'est la hauteur de la tête de manche. Mesurez de la pointe d\'épaule au niveau du dessous de bras (environ 2-3 cm sous l\'aisselle).' },

   // Guide descriptions - Bodice
   'guide.desc.bust': { en: 'Measure around the fullest part of the bust, keeping the tape horizontal and snug but not tight.', fr: 'Mesurez autour de la partie la plus forte de la poitrine, en gardant le ruban horizontal, ajusté mais pas serré.' },
   'guide.desc.neckline': { en: 'Measure around the base of the neck where a collar would sit, keeping the tape close but comfortable.', fr: 'Mesurez autour de la base du cou, là où un col se poserait, en gardant le ruban près du cou mais confortable.' },
   'guide.desc.shoulderLength': { en: 'Measure from the base of the neck (where it meets the shoulder) to the shoulder point (where the arm begins).', fr: 'Mesurez de la base du cou (où il rejoint l\'épaule) jusqu\'à la pointe d\'épaule (où le bras commence).' },
   'guide.desc.backWidth': { en: 'Measure across the back from armhole to armhole, approximately 10-15cm below the nape of the neck. Keep arms relaxed at sides.', fr: 'Mesurez en travers du dos d\'une emmanchure à l\'autre, environ 10-15 cm sous la nuque. Gardez les bras détendus le long du corps.' },
   'guide.desc.backLength': { en: 'Measure from the prominent bone at the back of the neck (7th cervical vertebra) straight down to the natural waistline.', fr: 'Mesurez de l\'os saillant à la base de la nuque (7e vertèbre cervicale) en ligne droite jusqu\'à la taille naturelle.' },

   // Guide tips - Skirt/Sleeve
   'guide.tip1': { en: 'Wear thin, fitted clothing or measure over undergarments', fr: 'Portez des vêtements fins et ajustés ou mesurez par-dessus les sous-vêtements' },
   'guide.tip2': { en: 'Use a flexible measuring tape, not a rigid ruler', fr: 'Utilisez un ruban à mesurer souple, pas une règle rigide' },
   'guide.tip3': { en: 'Stand naturally—don\'t hold your breath or slouch', fr: 'Tenez-vous naturellement — ne retenez pas votre souffle et ne vous voûtez pas' },
   'guide.tip4': { en: 'Have someone help you measure for better accuracy', fr: 'Faites-vous aider pour plus de précision' },
   'guide.tip5': { en: 'Take each measurement twice and use the average', fr: 'Prenez chaque mesure deux fois et utilisez la moyenne' },

   // Guide tips - Sleeve specific
   'guide.tip.sleeve1': { en: 'Wear a fitted shirt or measure over undergarments', fr: 'Portez une chemise ajustée ou mesurez par-dessus les sous-vêtements' },
   'guide.tip.sleeve2': { en: 'Keep your arm relaxed and slightly bent at the elbow', fr: 'Gardez le bras détendu et légèrement fléchi au coude' },
   'guide.tip.sleeve5': { en: 'Stand naturally—don\'t flex your arm muscles', fr: 'Tenez-vous naturellement — ne contractez pas les muscles du bras' },

   // Guide tips - Bodice specific
   'guide.tip.bodice1': { en: 'Wear a well-fitting bra (for bust measurements)', fr: 'Portez un soutien-gorge bien ajusté (pour les mesures de poitrine)' },
   'guide.tip.bodice2': { en: 'Stand naturally with arms relaxed at sides', fr: 'Tenez-vous naturellement avec les bras détendus le long du corps' },
   'guide.tip.bodice3': { en: 'Keep the tape snug but not tight', fr: 'Gardez le ruban ajusté mais pas serré' },
   'guide.tip.bodice4': { en: 'Have someone help for back measurements', fr: 'Faites-vous aider pour les mesures du dos' },
   'guide.tip.bodice5': { en: 'Take measurements over fitted clothing or undergarments', fr: 'Prenez les mesures par-dessus des vêtements ajustés ou des sous-vêtements' },
   'guide.tip.bodice6': { en: 'For back width (carrure dos), locate it by feeling where the arms connect to the body', fr: 'Pour la carrure dos, localisez-la en sentant où les bras se connectent au corps' },

   // Misc
   'misc.soon': { en: 'Soon', fr: 'Bientôt' },
   'misc.free': { en: 'Free', fr: 'Gratuit' },
  'misc.plan': { en: 'plan', fr: 'plan' },
  'misc.createPatterns': { en: 'Create your custom sewing patterns', fr: 'Créez vos patrons de couture sur mesure' },
  'misc.signInPrompt': { en: 'Sign in to save your measurements and access all pattern types.', fr: 'Connectez-vous pour sauvegarder vos mesures et accéder à tous les types de patrons.' },
  'misc.upgradePrompt': { en: 'Upgrade to access dress, pants, and sleeve patterns.', fr: 'Passez à un abonnement supérieur pour accéder aux patrons de robe, pantalon et manche.' },
  'misc.language': { en: 'Language', fr: 'Langue' },

  // Welcome page
  'welcome.badge': { en: 'Pattern drafting made personal', fr: 'Le patronage sur mesure' },
  'welcome.heroTitle1': { en: 'Sewing patterns built', fr: 'Des patrons de couture' },
  'welcome.heroTitle2': { en: 'to your body', fr: 'à vos mesures' },
  'welcome.heroDesc': { en: 'Enter your measurements, choose your pattern type, and download a custom-fit sloper in seconds. No more grading between sizes.', fr: 'Entrez vos mesures, choisissez votre type de patron, et téléchargez un patron ajusté en quelques secondes. Fini les gradations entre les tailles.' },
  'welcome.startDrafting': { en: 'Start Drafting', fr: 'Commencer' },
  'welcome.viewPlans': { en: 'View Plans', fr: 'Voir les offres' },
  'welcome.openApp': { en: 'Open App', fr: 'Ouvrir l\'app' },
  'welcome.featuresTitle': { en: 'Everything you need to draft', fr: 'Tout pour créer vos patrons' },
  'welcome.featuresDesc': { en: 'Professional-grade pattern tools, accessible to everyone.', fr: 'Des outils de patronage professionnels, accessibles à tous.' },
  'welcome.feat.measurements': { en: 'Custom Measurements', fr: 'Mesures personnalisées' },
  'welcome.feat.measurementsDesc': { en: 'Enter your exact body measurements and get pattern blocks tailored precisely to your shape.', fr: 'Entrez vos mesures corporelles exactes et obtenez des patrons de base parfaitement adaptés à votre morphologie.' },
  'welcome.feat.patterns': { en: 'Multiple Pattern Types', fr: 'Plusieurs types de patrons' },
  'welcome.feat.patternsDesc': { en: 'Skirts, bodices (dartless, with darts, knit), pants, and sleeves — all from one tool.', fr: 'Jupes, corsages (sans pinces, avec pinces, maille), pantalons et manches — tout dans un seul outil.' },
  'welcome.feat.categories': { en: 'Women, Men & Kids', fr: 'Femmes, Hommes & Enfants' },
  'welcome.feat.categoriesDesc': { en: 'Category-specific drafting logic ensures accurate results for every body type.', fr: 'Une logique de patronage par catégorie garantit des résultats précis pour chaque morphologie.' },
  'welcome.feat.pdf': { en: 'PDF Export', fr: 'Export PDF' },
  'welcome.feat.pdfDesc': { en: 'Download print-ready pattern PDFs instantly. No waiting, no shipping.', fr: 'Téléchargez des PDF de patrons prêts à imprimer instantanément. Pas d\'attente, pas de livraison.' },
  'welcome.pricingTitle': { en: 'Simple, transparent pricing', fr: 'Des tarifs simples et transparents' },
  'welcome.pricingDesc': { en: 'Start free with the skirt block. Upgrade when you need more.', fr: 'Commencez gratuitement avec le patron de jupe. Passez à un abonnement supérieur quand vous en avez besoin.' },
  'welcome.plan.free': { en: 'Free', fr: 'Gratuit' },
  'welcome.plan.basic': { en: 'Basic', fr: 'Essentiel' },
  'welcome.plan.pro': { en: 'Pro', fr: 'Pro' },
  'welcome.plan.getStarted': { en: 'Get Started', fr: 'Commencer' },
  'welcome.plan.startBasic': { en: 'Start Basic', fr: 'Choisir Essentiel' },
  'welcome.plan.goPro': { en: 'Go Pro', fr: 'Passer Pro' },
  'welcome.plan.mostPopular': { en: 'Most popular', fr: 'Le plus populaire' },
  'welcome.plan.feat.skirt': { en: 'Skirt pattern block', fr: 'Patron de jupe' },
  'welcome.plan.feat.allCategories': { en: 'All categories', fr: 'Toutes les catégories' },
  'welcome.plan.feat.pdfExport': { en: 'PDF export', fr: 'Export PDF' },
  'welcome.plan.feat.livePreview': { en: 'Live preview', fr: 'Aperçu en direct' },
  'welcome.plan.feat.allPatterns': { en: 'All pattern types', fr: 'Tous les types de patrons' },
  'welcome.plan.feat.saveProfiles': { en: 'Save measurement profiles', fr: 'Sauvegarder vos profils' },
  'welcome.plan.feat.tenPatterns': { en: '10 patterns/month', fr: '10 patrons/mois' },
  'welcome.plan.feat.prioritySupport': { en: 'Priority support', fr: 'Support prioritaire' },
  'welcome.plan.feat.unlimited': { en: 'Unlimited patterns', fr: 'Patrons illimités' },
  'welcome.plan.feat.unlimitedProfiles': { en: 'Unlimited profiles', fr: 'Profils illimités' },
  'welcome.plan.feat.allFuture': { en: 'All future pattern types', fr: 'Tous les futurs patrons' },
  'welcome.plan.feat.earlyAccess': { en: 'Early access to new features', fr: 'Accès anticipé aux nouveautés' },
  'welcome.testimonialsTitle': { en: 'Loved by makers', fr: 'Adopté par les créateurs' },
  'welcome.testimonial1': { en: 'Finally, a pattern tool that understands real bodies. The fit is incredible compared to standard size charts.', fr: 'Enfin, un outil de patronage qui comprend les vrais corps. L\'ajustement est incroyable comparé aux tableaux de tailles standard.' },
  'welcome.testimonial1Author': { en: 'Marie L.', fr: 'Marie L.' },
  'welcome.testimonial1Role': { en: 'Home Sewist', fr: 'Couturière amateur' },
  'welcome.testimonial2': { en: 'I use Sloper Studio for all my client fittings. The PDF export saves me hours of manual drafting.', fr: 'J\'utilise Sloper Studio pour tous mes essayages clients. L\'export PDF me fait gagner des heures de patronage manuel.' },
  'welcome.testimonial2Author': { en: 'James K.', fr: 'Jacques K.' },
  'welcome.testimonial2Role': { en: 'Tailor', fr: 'Tailleur' },
  'welcome.testimonial3': { en: 'The kids category is a game-changer. My children\'s clothes actually fit now!', fr: 'La catégorie enfants est une révolution. Les vêtements de mes enfants leur vont enfin !' },
  'welcome.testimonial3Author': { en: 'Sofia R.', fr: 'Sofia R.' },
  'welcome.testimonial3Role': { en: 'Parent & Maker', fr: 'Parent & créatrice' },
  'welcome.ctaTitle': { en: 'Ready to create your perfect fit?', fr: 'Prêt à créer votre patron parfait ?' },
  'welcome.ctaDesc': { en: 'Join thousands of sewists drafting custom patterns with Sloper Studio.', fr: 'Rejoignez des milliers de couturiers qui créent des patrons sur mesure avec Sloper Studio.' },
  'welcome.ctaButton': { en: 'Get Started Free', fr: 'Commencer gratuitement' },
  'welcome.footer': { en: 'Sloper Studio — Create custom-fit sewing patterns', fr: 'Sloper Studio — Créez des patrons de couture sur mesure' },

  // Adjustments page
  'adj.title': { en: 'Sloper Adjustment Guide', fr: 'Guide d\'ajustement du patron de base' },
  'adj.subtitle': { en: 'Choose a pattern type to see common fit issues and solutions.', fr: 'Choisissez un type de patron pour voir les problèmes d\'ajustement courants et leurs solutions.' },
  'adj.back': { en: 'Back', fr: 'Retour' },
  'adj.problem': { en: 'Problem:', fr: 'Problème :' },
  'adj.solution': { en: 'Solution:', fr: 'Solution :' },
  'adj.selectQuestion': { en: 'Select a fit issue below to see the solution.', fr: 'Sélectionnez un problème ci-dessous pour voir la solution.' },

  'adj.cat.bodice': { en: 'Bodice', fr: 'Corsage' },
  'adj.cat.skirt': { en: 'Skirt', fr: 'Jupe' },
  'adj.cat.pants': { en: 'Pants', fr: 'Pantalon' },
  'adj.cat.sleeve': { en: 'Sleeve', fr: 'Manche' },

  'adj.b1': { en: 'Armhole too deep or flat at the underarm', fr: 'Emmanchure trop profonde ou plate sous le bras' },
  'adj.b1.problem': { en: 'The armhole shape drops too low or appears too flat under the arm, causing discomfort or poor fit.', fr: 'L\'emmanchure descend trop bas ou semble trop plate sous le bras, causant inconfort ou mauvais ajustement.' },
  'adj.b1.solution': { en: 'Add ease to the across back (carrure dos) measurement. This will narrow the underarm and extend the shoulder length, lifting the armhole into a better position.', fr: 'Ajoutez de l\'aisance à la mesure de carrure dos. Cela réduira le dessous de bras et allongera l\'épaule, repositionnant l\'emmanchure.' },
  'adj.b1.tip': { en: 'Try adding 1–2 cm to the back width and redraft to see the effect.', fr: 'Essayez d\'ajouter 1 à 2 cm à la carrure dos et retracez pour voir l\'effet.' },

  'adj.b2': { en: 'Shoulder seam falls off the shoulder', fr: 'La couture d\'épaule tombe au-delà de l\'épaule' },
  'adj.b2.problem': { en: 'The shoulder seam extends past the shoulder point, creating a dropped-shoulder look when you intended a fitted one.', fr: 'La couture d\'épaule dépasse la pointe de l\'épaule, créant un effet épaule tombante alors que vous vouliez un ajustement près du corps.' },
  'adj.b2.solution': { en: 'Reduce the shoulder length measurement by 0.5–1 cm. You can also check that your back width measurement isn\'t too wide, as this can push the shoulder out.', fr: 'Réduisez la longueur d\'épaule de 0,5 à 1 cm. Vérifiez aussi que votre carrure dos n\'est pas trop large, car cela peut repousser l\'épaule.' },
  'adj.b2.tip': { en: 'Mark your shoulder point precisely—it\'s where the arm begins to curve downward.', fr: 'Marquez précisément votre pointe d\'épaule — c\'est là où le bras commence à courber vers le bas.' },

  'adj.b3': { en: 'Bodice is too tight across the chest', fr: 'Le corsage est trop serré au niveau de la poitrine' },
  'adj.b3.problem': { en: 'The front or back feels restrictive across the bust or upper chest area, pulling at the armhole.', fr: 'Le devant ou le dos est trop serré au niveau de la poitrine, tirant au niveau de l\'emmanchure.' },
  'adj.b3.solution': { en: 'Increase the bust ease. For woven fabrics, ensure you have at least 4–6 cm of total ease. For knits, you may use 0 to negative ease depending on stretch.', fr: 'Augmentez l\'aisance de poitrine. Pour les tissus chaîne et trame, prévoyez au moins 4 à 6 cm d\'aisance totale. Pour la maille, vous pouvez utiliser 0 ou une aisance négative selon l\'extensibilité.' },
  'adj.b3.tip': { en: 'Always check ease against the intended fabric type before cutting.', fr: 'Vérifiez toujours l\'aisance en fonction du tissu prévu avant de couper.' },

  'adj.b4': { en: 'Neckline gaps or stands away from the body', fr: 'L\'encolure bâille ou s\'écarte du corps' },
  'adj.b4.problem': { en: 'The neckline doesn\'t sit flat against the base of the neck, creating gaps especially at the front or back.', fr: 'L\'encolure ne repose pas à plat contre la base du cou, créant des ouvertures surtout devant ou dans le dos.' },
  'adj.b4.solution': { en: 'Reduce the neckline circumference slightly (0.5–1 cm) or adjust the front/back neckline depth. A shallower neckline depth will bring the edge closer to the neck.', fr: 'Réduisez légèrement le tour de cou (0,5 à 1 cm) ou ajustez la profondeur d\'encolure devant/dos. Une encolure moins profonde rapprochera le bord du cou.' },
  'adj.b4.tip': { en: 'Pin-fit a muslin to determine exactly where the gap occurs before adjusting the pattern.', fr: 'Épinglez une toile d\'essai pour déterminer exactement où le bâillement se produit avant de modifier le patron.' },

  'adj.b5': { en: 'Back length is too long or too short', fr: 'La longueur dos est trop longue ou trop courte' },
  'adj.b5.problem': { en: 'The waistline of the bodice doesn\'t align with your natural waist—either riding up or dropping below.', fr: 'La ligne de taille du corsage ne correspond pas à votre taille naturelle — elle remonte ou descend.' },
  'adj.b5.solution': { en: 'Adjust the back length (longueur taille-dos) measurement. Lengthen or shorten by the exact difference between your measured waist and the pattern waistline.', fr: 'Ajustez la mesure de longueur taille-dos. Rallongez ou raccourcissez de la différence exacte entre votre taille mesurée et la ligne de taille du patron.' },
  'adj.b5.tip': { en: 'Measure from the prominent bone at the nape of the neck straight down to a tie around your natural waist.', fr: 'Mesurez depuis l\'os saillant à la nuque en ligne droite jusqu\'à un lien noué autour de votre taille naturelle.' },

  'adj.s1': { en: 'Skirt rides up at the back', fr: 'La jupe remonte dans le dos' },
  'adj.s1.problem': { en: 'The back hemline of the skirt is shorter than the front, often caused by a prominent seat.', fr: 'L\'ourlet arrière de la jupe est plus court que l\'avant, souvent à cause de fesses proéminentes.' },
  'adj.s1.solution': { en: 'Add length to the center back of the skirt pattern. Typically 1–3 cm is enough. Taper the addition to nothing at the side seam.', fr: 'Ajoutez de la longueur au milieu dos du patron de jupe. En général, 1 à 3 cm suffisent. Dégradez l\'ajout à zéro à la couture de côté.' },
  'adj.s1.tip': { en: 'Compare front and back measurements from waist to floor to quantify the difference.', fr: 'Comparez les mesures devant et dos de la taille au sol pour quantifier la différence.' },

  'adj.s2': { en: 'Waistband is too tight or too loose', fr: 'La ceinture est trop serrée ou trop lâche' },
  'adj.s2.problem': { en: 'The waistband doesn\'t sit comfortably—it digs in or slides down.', fr: 'La ceinture n\'est pas confortable — elle serre ou glisse.' },
  'adj.s2.solution': { en: 'Adjust the waist measurement. For a tight waistband, add 1–2 cm of ease. For a loose waistband, reduce the waist measurement or add darts for a better fit.', fr: 'Ajustez la mesure de tour de taille. Pour une ceinture serrée, ajoutez 1 à 2 cm d\'aisance. Pour une ceinture lâche, réduisez le tour de taille ou ajoutez des pinces.' },
  'adj.s2.tip': { en: 'Tie a string around your waist and let it settle naturally to find your true waistline.', fr: 'Nouez un fil autour de votre taille et laissez-le se placer naturellement pour trouver votre vraie ligne de taille.' },

  'adj.s3': { en: 'Side seams swing forward or backward', fr: 'Les coutures de côté basculent vers l\'avant ou l\'arrière' },
  'adj.s3.problem': { en: 'The side seams of the skirt don\'t hang straight—they pull toward the front or back.', fr: 'Les coutures de côté de la jupe ne tombent pas droit — elles tirent vers l\'avant ou l\'arrière.' },
  'adj.s3.solution': { en: 'Redistribute the dart intake between front and back. If the seam swings forward, increase the back dart and decrease the front. Vice versa if it swings backward.', fr: 'Redistribuez les pinces entre le devant et le dos. Si la couture bascule vers l\'avant, augmentez la pince dos et réduisez la pince devant. Inversement si elle bascule vers l\'arrière.' },
  'adj.s3.tip': { en: 'Check that front and back hip measurements are balanced relative to the side seam position.', fr: 'Vérifiez que les mesures de hanches devant et dos sont équilibrées par rapport à la position de la couture de côté.' },

  'adj.p1': { en: 'Crotch is too tight or too loose', fr: 'L\'entrejambe est trop serré ou trop lâche' },
  'adj.p1.problem': { en: 'The crotch area pulls uncomfortably or has excess fabric hanging below.', fr: 'La zone d\'entrejambe tire inconfortablement ou a un excès de tissu qui pend.' },
  'adj.p1.solution': { en: 'For a tight crotch, lower the crotch point by 1–2 cm and add to the crotch extension. For a loose crotch, raise the crotch point and reduce the extension.', fr: 'Pour un entrejambe serré, abaissez le point d\'entrejambe de 1 à 2 cm et augmentez l\'extension. Pour un entrejambe lâche, remontez le point et réduisez l\'extension.' },
  'adj.p1.tip': { en: 'Sit down while pin-fitting to check crotch ease—you need at least 2.5 cm of ease when seated.', fr: 'Asseyez-vous pendant l\'essayage pour vérifier l\'aisance d\'entrejambe — il faut au moins 2,5 cm d\'aisance en position assise.' },

  'adj.p2': { en: 'Pants pull at the thigh', fr: 'Le pantalon tire au niveau de la cuisse' },
  'adj.p2.problem': { en: 'The thigh area feels too tight, creating horizontal wrinkles and restricting movement.', fr: 'La zone de cuisse est trop serrée, créant des plis horizontaux et limitant les mouvements.' },
  'adj.p2.solution': { en: 'Increase the thigh circumference measurement by 1–3 cm. Make sure the ease is distributed evenly between front and back.', fr: 'Augmentez la mesure de tour de cuisse de 1 à 3 cm. Assurez-vous que l\'aisance est répartie uniformément entre le devant et le dos.' },
  'adj.p2.tip': { en: 'Measure the thigh while sitting for the most accurate reading, as the thigh spreads when seated.', fr: 'Mesurez la cuisse en position assise pour la lecture la plus précise, car la cuisse s\'élargit en position assise.' },

  'adj.p3': { en: 'Leg length is uneven', fr: 'La longueur de jambe est inégale' },
  'adj.p3.problem': { en: 'One pant leg appears longer than the other, or the hem is uneven all around.', fr: 'Une jambe de pantalon semble plus longue que l\'autre, ou l\'ourlet est inégal.' },
  'adj.p3.solution': { en: 'Verify both outseam and inseam measurements on each leg. Adjust the pattern by lengthening or shortening one side. Check if a hip height difference is causing the issue.', fr: 'Vérifiez les mesures de couture extérieure et intérieure sur chaque jambe. Ajustez le patron en rallongeant ou raccourcissant un côté. Vérifiez si une différence de hauteur de hanche cause le problème.' },
  'adj.p3.tip': { en: 'Stand on a flat surface and have someone measure from waist to floor on both sides.', fr: 'Tenez-vous sur une surface plane et faites-vous mesurer de la taille au sol des deux côtés.' },

  'adj.sl1': { en: 'Sleeve cap is too tight or too loose', fr: 'La tête de manche est trop serrée ou trop ample' },
  'adj.sl1.problem': { en: 'The sleeve cap pulls or creates excess puckering at the armhole seam.', fr: 'La tête de manche tire ou crée des fronces excessives à la couture d\'emmanchure.' },
  'adj.sl1.solution': { en: 'Adjust the armhole depth measurement. A deeper armhole depth will create a taller sleeve cap. Ensure the sleeve cap ease is 3–5 cm larger than the armhole circumference.', fr: 'Ajustez la mesure de profondeur d\'emmanchure. Une emmanchure plus profonde créera une tête de manche plus haute. L\'embu de la tête de manche doit être de 3 à 5 cm de plus que le tour d\'emmanchure.' },
  'adj.sl1.tip': { en: 'Walk the sleeve cap around the armhole on paper to verify the ease distribution before cutting fabric.', fr: 'Faites rouler la tête de manche autour de l\'emmanchure sur papier pour vérifier la répartition de l\'embu avant de couper le tissu.' },

  'adj.sl2': { en: 'Sleeve is too tight at the upper arm', fr: 'La manche est trop serrée au bras' },
  'adj.sl2.problem': { en: 'The sleeve feels restrictive around the bicep, limiting arm movement.', fr: 'La manche est trop ajustée au niveau du biceps, limitant les mouvements du bras.' },
  'adj.sl2.solution': { en: 'Increase the upper arm circumference measurement by 1–2 cm. This will widen the sleeve at the bicep level without affecting the sleeve cap shape.', fr: 'Augmentez la mesure du tour de bras de 1 à 2 cm. Cela élargira la manche au niveau du biceps sans modifier la forme de la tête de manche.' },
  'adj.sl2.tip': { en: 'Measure the upper arm with the arm relaxed and again with the arm flexed—use the larger measurement plus ease.', fr: 'Mesurez le tour de bras avec le bras détendu puis avec le bras fléchi — utilisez la mesure la plus grande plus l\'aisance.' },

  // Pricing page
  'pricing.title': { en: 'Choose Your Plan', fr: 'Choisissez votre formule' },
  'pricing.subtitle': { en: 'Create professional sewing patterns with our sloper generator. Choose a subscription or purchase individual patterns.', fr: 'Créez des patrons de couture professionnels avec notre générateur de bases. Choisissez un abonnement ou achetez des patrons individuels.' },
  'pricing.currentPlan': { en: 'Current Plan', fr: 'Formule actuelle' },
  'pricing.mostPopular': { en: 'Most Popular', fr: 'Le plus populaire' },
  'pricing.youreOn': { en: "You're currently on the", fr: 'Vous êtes actuellement sur la formule' },
  'pricing.plan': { en: 'plan', fr: '' },
  'pricing.patternsUsed': { en: 'patterns used this month', fr: 'patrons utilisés ce mois-ci' },
  'pricing.manageSubscription': { en: 'Manage Subscription', fr: 'Gérer l\'abonnement' },
  'pricing.backToApp': { en: 'Back to App', fr: 'Retour à l\'application' },
  'pricing.subscribe': { en: 'Subscribe', fr: 'S\'abonner' },
  'pricing.loading': { en: 'Loading...', fr: 'Chargement...' },
  'pricing.perPattern': { en: '/pattern', fr: '/patron' },
  'pricing.perMonth': { en: '/month', fr: '/mois' },
  
  // Single purchase card
  'pricing.single.title': { en: 'Single Pattern', fr: 'Patron unique' },
  'pricing.single.desc': { en: 'One-time purchase', fr: 'Achat à l\'unité' },
  'pricing.single.f1': { en: 'Access to one pattern type', fr: 'Accès à un type de patron' },
  'pricing.single.f2': { en: 'Lifetime access', fr: 'Accès à vie' },
  'pricing.single.f3': { en: 'PDF export included', fr: 'Export PDF inclus' },
  'pricing.single.note': { en: 'Purchase individual patterns from the app', fr: 'Achetez des patrons individuels depuis l\'application' },

  // Basic card
  'pricing.basic.title': { en: 'Basic', fr: 'Basique' },
  'pricing.basic.desc': { en: 'For hobbyists', fr: 'Pour les amateurs' },
  'pricing.basic.f1': { en: '5 patterns per month', fr: '5 patrons par mois' },
  'pricing.basic.f2': { en: 'All pattern types', fr: 'Tous les types de patrons' },
  'pricing.basic.f3': { en: 'Save measurements', fr: 'Sauvegarde des mesures' },
  'pricing.basic.f4': { en: 'PDF export', fr: 'Export PDF' },

  // Pro card
  'pricing.pro.title': { en: 'Pro', fr: 'Pro' },
  'pricing.pro.desc': { en: 'For professionals', fr: 'Pour les professionnels' },
  'pricing.pro.f1': { en: 'Unlimited patterns', fr: 'Patrons illimités' },
  'pricing.pro.f2': { en: 'All pattern types', fr: 'Tous les types de patrons' },
  'pricing.pro.f3': { en: 'Save unlimited measurements', fr: 'Mesures illimitées' },
  'pricing.pro.f4': { en: 'Priority support', fr: 'Support prioritaire' },

  // FAQ
  'pricing.faq.title': { en: 'Frequently Asked Questions', fr: 'Questions fréquentes' },
  'pricing.faq.q1': { en: 'What patterns are included?', fr: 'Quels patrons sont inclus ?' },
  'pricing.faq.a1': { en: 'Currently we offer skirt slopers, with bodice, dress, pants, and sleeve patterns coming soon. All subscribers get access to new patterns as they\'re released.', fr: 'Nous proposons actuellement des bases de jupes, avec les corsages, robes, pantalons et manches à venir. Tous les abonnés ont accès aux nouveaux patrons dès leur sortie.' },
  'pricing.faq.q2': { en: 'Can I cancel anytime?', fr: 'Puis-je annuler à tout moment ?' },
  'pricing.faq.a2': { en: 'Yes! You can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.', fr: 'Oui ! Vous pouvez annuler votre abonnement à tout moment. Vous conservez l\'accès jusqu\'à la fin de votre période de facturation.' },
  'pricing.faq.q3': { en: 'Do single purchases expire?', fr: 'Les achats à l\'unité expirent-ils ?' },
  'pricing.faq.a3': { en: 'No, single pattern purchases give you lifetime access to that pattern type.', fr: 'Non, l\'achat d\'un patron vous donne un accès à vie à ce type de patron.' },

  // Pattern Locked
  'locked.title': { en: 'Pattern Locked', fr: 'Patron verrouillé' },
  'locked.description': { en: 'Subscribe to access this pattern, or purchase it individually for $4.99.', fr: 'Abonnez-vous pour accéder à ce patron, ou achetez-le individuellement pour 4,99 $.' },
  'locked.buyFor': { en: 'Buy for $4.99', fr: 'Acheter pour 4,99 $' },

  // Toasts
  'toast.signInToPurchase': { en: 'Please sign in to purchase patterns', fr: 'Veuillez vous connecter pour acheter des patrons' },
  'toast.checkoutFailed': { en: 'Failed to start checkout', fr: 'Échec du lancement du paiement' },
  'toast.pdfDownloaded': { en: 'PDF downloaded!', fr: 'PDF téléchargé !' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    if (saved === 'en' || saved === 'fr') return saved;
    const nav = navigator.language?.toLowerCase() ?? '';
    return nav.startsWith('fr') ? 'fr' : 'en';
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
