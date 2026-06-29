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
   'title.dartlessPants': { en: 'Dartless Pants', fr: 'Pantalon sans pinces' },
   'title.pantsWithDarts': { en: 'Pants with Darts', fr: 'Pantalon avec pinces' },
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
  'meas.hipHeight': { en: 'Waist to Hip Height', fr: 'Distance taille bassin' },
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
  'hint.wearingEaseAllowance': { en: 'Added to each quarter panel (front and back separately)', fr: 'Ajoutée à chaque quart de pièce (devant et dos séparément)' },
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
  'hint.hipHeight': { en: 'Distance from waist to hip bone', fr: 'Distance de la taille au bassin' },
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
  'hint.addedWearingRoom': { en: 'Added to each quarter panel (front and back separately)', fr: 'Ajoutée à chaque quart de pièce (devant et dos séparément)' },

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
  'note.standardEase': { en: 'The pattern includes ease.', fr: 'Le patron inclut de l\'aisance.' },
  'note.optimizedKnit': { en: 'Optimized for stretch knit fabrics.', fr: 'Optimisé pour les tissus maille extensibles.' },
  'tooltip.ease': {
    en: "Ease is the difference between your body measurements and the finished garment.\nIt's added to each quarter panel (front and back separately).\nExample: 2 cm ease per quarter = 8 cm extra around the full circumference.",
    fr: "L'aisance est l'écart entre vos mesures corporelles et le patron fini.\nElle est ajoutée sur chaque quart de pièce (devant et dos séparément).\nUne aisance de 2 cm par quart = 8 cm de plus sur le tour total."
  },
  'note.easeFitted': { en: 'Fitted: 1–2 cm/quarter.', fr: 'Près du corps : 1–2 cm/quart.' },
  'note.easeLoose': { en: 'Loose: 3–4 cm/quarter.', fr: 'Ample : 3–4 cm/quart.' },
  'note.simpleBodice': { en: 'Simple bodice block without bust darts', fr: 'Corsage de base sans pinces de poitrine' },
  'warn.noSeamAllowance': {
    en: 'This pattern is a basic block with no seam allowances. Add seam allowances (typically 1–1.5 cm), after any pattern adjustments, when transferring to fabric.',
    fr: 'Ce patron est un patron de base sans marges de couture. Ajoutez vos marges (généralement 1 à 1,5 cm), après modification éventuelle du patron, lors du transfert sur le tissu.',
  },

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
  'nav.settings': { en: 'Settings', fr: 'Paramètres' },
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
   'guide.pantsLength': { en: 'Pants Length', fr: 'Longueur de pantalon' },
   'guide.crotchDepth': { en: 'Crotch Depth', fr: 'Hauteur d\'entrejambe' },
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
   'guide.desc.pantsLength': { en: 'Measure from your natural waistline down to the desired pants length (usually to the ankle). Stand straight and have someone help for accuracy.', fr: 'Mesurez de la taille naturelle jusqu\'à la longueur souhaitée du pantalon (généralement jusqu\'à la cheville). Restez debout et faites-vous aider pour plus de précision.' },
   'guide.desc.crotchDepth': { en: 'Sit on a flat, hard surface. Measure from your natural waistline straight down to the seat surface. This gives you the crotch depth.', fr: 'Asseyez-vous sur une surface plane et dure. Mesurez de la taille naturelle jusqu\'à la surface du siège. Cela donne la hauteur d\'entrejambe.' },

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

   // Bodice guide views
   'guide.frontView': { en: 'Front view', fr: 'Vue de devant' },
   'guide.backView': { en: 'Back view', fr: 'Vue de dos' },
   'guide.clickToSwitch': { en: 'Click a measurement to see the corresponding view', fr: 'Cliquez sur une mesure pour voir le diagramme correspondant' },
   'guide.nape': { en: 'Nape', fr: 'Nuque' },

   // Pattern piece labels
   'piece.front': { en: 'FRONT', fr: 'DEVANT' },
   'piece.back': { en: 'BACK', fr: 'DOS' },
   'piece.cutOnFold': { en: 'Cut 1 on fold', fr: 'Couper 1 au pli' },
   'piece.quarterWaist': { en: '¼ waist', fr: '¼ taille' },
   'piece.waistToHip': { en: 'Waist-hip', fr: 'Taille-hanches' },
   'piece.showMeasures': { en: 'Measurements', fr: 'Mesures' },
   'legend.patternEdge': { en: 'Pattern edge', fr: 'Bord du patron' },
   'legend.grainLine': { en: 'Grain line', fr: 'Droit-fil' },
   'legend.measurements': { en: 'Measurements', fr: 'Mesures' },
   'piece.fold': { en: 'FOLD', fr: 'PLI' },
   'piece.bust': { en: 'Bust', fr: 'Poitrine' },
   'piece.backWidth': { en: 'Back width', fr: 'Carrure dos' },
   'piece.cut2': { en: 'Cut 2', fr: 'Couper 2' },
   'piece.hip': { en: 'Hip', fr: 'Hanches' },
   'piece.crotch': { en: 'Crotch', fr: 'Entrejambe' },
   'piece.thigh': { en: 'Thigh', fr: 'Cuisse' },
   'piece.knee': { en: 'Knee', fr: 'Genou' },
   'info.customPatterns': { en: 'Custom Patterns', fr: 'Patrons sur mesure' },
   'info.customPatternsDesc': { en: 'Create basic pattern blocks made to your exact measurements. They serve as the foundation for creating any garment style, from simple A-line skirts to complex fitted designs.', fr: 'Créez des patrons de base adaptés à vos mesures exactes. Ils servent de fondation pour créer tout style de vêtement, des jupes trapèze simples aux modèles ajustés complexes.' },
   'info.bodicePattern': { en: 'Bodice Pattern', fr: 'Patron de corsage' },
   'info.bodicePatternDesc': { en: 'The bodice pattern includes front and back panels with bust darts for shaping. It forms the basis for tops, dresses, and jackets with proper fit through the torso.', fr: 'Le patron de corsage comprend des panneaux devant et dos avec des pinces de poitrine pour la mise en forme. Il constitue la base des hauts, robes et vestes avec un ajustement parfait au buste.' },
   'info.pantsPattern': { en: 'Pants Pattern', fr: 'Patron de pantalon' },
   'info.pantsPatternDesc': { en: 'The pants pattern includes front and back panels with waist dart for shaping. Full measurement control from waist to ankle for a perfect fit.', fr: 'Le patron de pantalon comprend des panneaux devant et dos avec une pince de taille. Contrôle complet des mesures de la taille à la cheville pour un ajustement parfait.' },
   'info.footer': { en: 'Petit Citron Studio — Create custom-fit sewing patterns', fr: 'Petit Citron Studio — Créez vos patrons de couture sur mesure' },

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
  'welcome.plan.free': { en: 'Découverte', fr: 'Découverte' },
  'welcome.plan.freeDesc': { en: 'To get started', fr: 'Pour débuter' },
  'welcome.plan.basic': { en: 'Atelier', fr: 'Atelier' },
  'welcome.plan.basicDesc': { en: 'For enthusiasts', fr: 'Pour les passionné.e.s' },
  'welcome.plan.pro': { en: 'Studio', fr: 'Studio' },
  'welcome.plan.proDesc': { en: 'To go further', fr: 'Pour aller plus loin' },
  'welcome.plan.getStarted': { en: 'Get Started', fr: 'Commencer' },
  'welcome.plan.startBasic': { en: 'Start Basic', fr: 'Choisir Essentiel' },
  'welcome.plan.goPro': { en: 'Go Pro', fr: 'Passer Pro' },
  'welcome.plan.mostPopular': { en: 'Most popular', fr: 'Le plus populaire' },
  'welcome.plan.feat.skirt': { en: 'Skirt pattern block', fr: 'Patron de jupe' },
  'welcome.plan.feat.allCategories': { en: 'All categories', fr: 'Toutes les catégories' },
  'welcome.plan.feat.pdfExport': { en: 'PDF export', fr: 'Export PDF' },
  'welcome.plan.feat.livePreview': { en: 'Live preview', fr: 'Aperçu en direct' },
  'welcome.plan.feat.allPatterns': { en: 'All pattern types', fr: 'Tous les types de patrons' },
  'welcome.plan.feat.saveProfiles': { en: 'Save measurements', fr: 'Sauvegarde des mesures' },
  'welcome.plan.feat.tenPatterns': { en: '10 patterns/month', fr: '10 patrons par mois' },
  'welcome.plan.feat.adjustmentGuide': { en: 'Fitting guide included', fr: 'Guide d\'ajustement inclus' },
  'welcome.plan.feat.prioritySupport': { en: 'Priority support', fr: 'Support prioritaire' },
  'welcome.plan.feat.unlimited': { en: 'Unlimited patterns', fr: 'Patrons illimités' },
  'welcome.plan.feat.unlimitedProfiles': { en: 'Save measurements', fr: 'Sauvegarde des mesures' },
  'welcome.plan.feat.allFuture': { en: 'Early access to new features', fr: 'Accès anticipé aux nouveautés' },
  'welcome.plan.feat.earlyAccess': { en: 'Early access to new features', fr: 'Accès anticipé aux nouveautés' },
  'welcome.testimonialsTitle': { en: 'Loved by makers', fr: 'Adopté par les créateurs' },
  'welcome.testimonial1': { en: 'Finally, a pattern tool that understands real bodies. The fit is incredible compared to standard size charts.', fr: 'Enfin, un outil de patronage qui comprend les vrais corps. L\'ajustement est incroyable comparé aux tableaux de tailles standard.' },
  'welcome.testimonial1Author': { en: 'Marie L.', fr: 'Marie L.' },
  'welcome.testimonial1Role': { en: 'Home Sewist', fr: 'Couturière amateur' },
  'welcome.testimonial2': { en: 'I use Petit Citron Studio for all my client fittings. The PDF export saves me hours of manual drafting.', fr: 'J\'utilise Petit Citron Studio pour tous mes essayages clients. L\'export PDF me fait gagner des heures de patronage manuel.' },
  'welcome.testimonial2Author': { en: 'James K.', fr: 'Jacques K.' },
  'welcome.testimonial2Role': { en: 'Tailor', fr: 'Tailleur' },
  'welcome.testimonial3': { en: 'The kids category is a game-changer. My children\'s clothes actually fit now!', fr: 'La catégorie enfants est une révolution. Les vêtements de mes enfants leur vont enfin !' },
  'welcome.testimonial3Author': { en: 'Sofia R.', fr: 'Sofia R.' },
  'welcome.testimonial3Role': { en: 'Parent & Maker', fr: 'Parent & créatrice' },
  'welcome.ctaTitle': { en: 'Ready to create your perfect fit?', fr: 'Prêt à créer votre patron parfait ?' },
  'welcome.ctaDesc': { en: 'Be among the first to create your custom sewing patterns with Petit Citron Studio.', fr: 'Rejoignez les premières couturières à créer leurs patrons sur mesure.' },
  'welcome.ctaButton': { en: 'Get Started Free', fr: 'Commencer gratuitement' },
  'welcome.footer': { en: 'Petit Citron Studio — Create custom-fit sewing patterns', fr: 'Petit Citron Studio — Créez des patrons de couture sur mesure' },

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

  // Bodice sub-categories
  'adj.bodice.selectSection': { en: 'Select a correction section.', fr: 'Sélectionnez une section de corrections.' },
  'adj.bodice.sub.neckline': { en: 'Neckline Corrections', fr: 'Corrections à l\'encolure' },
  'adj.bodice.sub.shoulder': { en: 'Across Shoulder Corrections', fr: 'Corrections des épaules' },
  'adj.bodice.sub.acrossFrontBack': { en: 'Across Front & Across Back Corrections', fr: 'Corrections de carrure avant & dos' },
  'adj.bodice.sub.armholeRaglan': { en: 'Armhole & Raglan Sleeve Corrections', fr: 'Corrections d\'emmanchure & manche raglan' },
  'adj.bodice.sub.setInSleeve': { en: 'Set-in Sleeve Corrections', fr: 'Corrections de manche montée' },
  'adj.bodice.sub.bust': { en: 'Bust Corrections', fr: 'Corrections de poitrine' },
  'adj.bodice.sub.backDraglines': { en: 'Back Draglines & Hemline Corrections', fr: 'Plis au dos & corrections d\'ourlet' },

  // Neckline corrections
  'adj.bn1': { en: 'Front neckline gaps', fr: 'L\'encolure devant bâille' },
  'adj.bn1.problem': {
    en: 'This is often the first thing to check. On a well-constructed pattern, the front neckline width should be equal to or slightly narrower than the back. If the front neckline is wider than the back, the fabric has nowhere to go and floats away from the skin.\n\nTo check: align both pattern pieces (front and back) at the High Point Shoulder (HPS). Compare the widths. If the front extends beyond the back, this is where you need to act — not on the neckline curve itself. The front neckline can be narrower than the back when there is a closure (zip, buttons...) but it cannot be wider.',
    fr: 'C\'est souvent le premier point à vérifier. Sur un patron bien construit, la largeur de l\'encolure devant doit être égale ou légèrement inférieure à celle du dos. Si l\'encolure devant est plus large que le dos, le tissu n\'a nulle part où aller et il flotte sur la peau.\n\nPour vérifier : alignez les deux pièces du patron (dos et devant) au niveau du point d\'épaule haut (PEH ou HPS en anglais). Comparez les largeurs. Si le devant dépasse, c\'est là que vous devez agir, pas sur la courbe de l\'encolure. L\'encolure devant peut être plus étroite que l\'encolure dos s\'il y a un système de fermeture (zip, boutons...) mais elle ne peut pas être plus large.',
  },
  'adj.bn1.solution': { en: '', fr: '' },
  'adj.bn1.tip': { en: '', fr: '' },

  'adj.bn1.sub1': { en: 'Bodice without princess seam', fr: 'Cas du corsage sans couture princesse' },
  'adj.bn1.sub1.step1': {
    en: 'Step 1 — Pin and measure\n\nBefore touching the pattern, work on your muslin. Pin out the excess fabric at the neckline until it lies flat against the body. Measure the amount you pinned and note it for later.',
    fr: 'Étape 1 — Épingler et mesurer\n\nAvant de toucher au patron, travaillez sur votre toile. Pincez le tissu en excès à l\'encolure jusqu\'à ce qu\'elle repose correctement contre le corps. Mesurez la quantité que vous avez épinglée et notez ce chiffre pour plus tard.',
  },
  'adj.bn1.sub1.step2': {
    en: 'Step 2 — Balance the neckline widths\n\nAlign the front and back pieces at the High Point Shoulder (HPS). The illustration shows an imbalanced neckline on the left (❌) and the correct balance on the right (✓): the front neckline must not extend beyond the back.',
    fr: 'Étape 2 — Équilibrer les largeurs d\'encolure\n\nAlignez les pièces devant et dos au point d\'épaule haut (PEH). L\'illustration montre à gauche un déséquilibre (❌) et à droite la situation correcte (✓) : l\'encolure devant ne doit pas dépasser l\'encolure dos.',
  },
  'adj.bn1.sub1.option1': {
    en: 'Option 1 — Reduce the width at center front\n\nTake in the center front seam. This is straightforward but slightly reduces the bust and waist circumference measurements.',
    fr: 'Option 1 — Réduire la largeur au milieu devant\n\nRentrez la couture du milieu devant. Solution simple, mais cela réduit légèrement les mesures de tour de poitrine et de taille.',
  },
  'adj.bn1.sub1.option2': {
    en: 'Option 2 — Move the HPS inward\n\nMove the High Point Shoulder (HPS) inward to reduce the neckline width, then correct the Low Point Shoulder (LPS) to maintain shoulder length. This option is often preferable as it does not change circumference measurements.',
    fr: 'Option 2 — Déplacer le PEH vers l\'intérieur\n\nDéplacez le point d\'épaule haut (PEH) vers l\'intérieur pour réduire la largeur d\'encolure, puis corrigez le point d\'épaule bas (PEB) pour conserver la longueur d\'épaule. Cette option est souvent préférable car elle ne modifie pas les mesures de circonférence.',
  },
  'adj.bn1.sub1.tip': {
    en: 'Important: a sewn-in zip adds approximately 0.5 cm on each side (1 cm total). If you don\'t account for this, the gaping will return even after correction.',
    fr: 'Important : une fermeture à glissière cousue ajoute environ 0,5 cm de chaque côté (1 cm au total). Si vous n\'en tenez pas compte, le bâillement réapparaîtra même après correction.',
  },

  'adj.bn1.sub2': { en: 'Bodice with princess seam from the armhole', fr: 'Cas du corsage avec couture princesse partant de l\'emmanchure' },
  'adj.bn1.sub2.intro': {
    en: 'There is excess fabric at the front neckline. If other wrinkles appear elsewhere on the garment pointing toward the bust, this may indicate that a full bust adjustment is needed. Refer to the bust corrections chapter to correctly identify this fitting issue.',
    fr: 'Il y a un excès de tissu au niveau de l\'encolure devant. Si d\'autres plis apparaissent ailleurs sur le vêtement et pointent vers la poitrine, cela indique qu\'un ajustement pour forte poitrine pourrait être nécessaire. Consultez le chapitre sur les corrections de poitrine pour identifier correctement ce problème d\'ajustement.',
  },
  'adj.bn1.sub2.correction': {
    en: 'If the step 2 techniques are not sufficient, apply a slash and close correction:',
    fr: 'Si les techniques de l\'étape 2 ne suffisent pas, appliquez une correction de type « slash & close ». Pour cela :',
  },
  'adj.bn1.sub2.steps': {
    en: '1. Pin out the excess fabric at the neckline and measure the amount pinned.\n2. On the pattern, draw two lines at the exact location where you pinned the muslin, running from the princess seam to the neckline. The lines should be spaced apart by the amount of excess fabric (the total width of the pinned fold).\n3. Slash and close the pattern by rotating the upper portion downward.\n4. True up the neckline and princess seam to create a smooth, continuous curve.',
    fr: '1. Épinglez l\'excédent de tissu au niveau de l\'encolure et mesurez la quantité que vous avez épinglée.\n2. Sur le patron, tracez deux lignes à l\'endroit précis où vous avez épinglé la toile, en partant de la couture princesse jusqu\'à l\'encolure. Les lignes doivent être espacées de la valeur de tissu en trop (la largeur totale du pli).\n3. Incisez et refermez le patron en basculant le haut du patron vers le bas.\n4. Ajustez l\'encolure et la couture princesse afin d\'obtenir une courbe continue.',
  },
  'adj.bn1.sub2.note': {
    en: 'Don\'t forget: adjust corresponding pattern pieces such as facings and linings with the same corrections.',
    fr: 'N\'oubliez pas : ajustez les pièces de patron correspondantes comme les parementures et les doublures, avec les mêmes corrections de patron.',
  },

  'adj.bn1.sub3': { en: 'Bodice with princess seam from the shoulder', fr: 'Cas du corsage avec couture princesse partant de l\'épaule' },
  'adj.bn1.sub3.intro': {
    en: 'There is excess fabric at the front neckline. If other wrinkles appear elsewhere on the garment pointing toward the bust, this may indicate that a full bust adjustment is needed. Refer to the bust corrections chapter to correctly identify this fitting issue.',
    fr: 'Il y a un excès de tissu au niveau de l\'encolure devant. Si d\'autres plis apparaissent ailleurs sur le vêtement et pointent vers la poitrine, cela indique qu\'un ajustement pour forte poitrine pourrait être nécessaire. Consultez le chapitre sur les corrections de poitrine pour identifier correctement ce problème d\'ajustement.',
  },
  'adj.bn1.sub3.correction': {
    en: 'If the step 2 techniques are not sufficient, you will need to deepen the princess seam:',
    fr: 'Si les techniques de l\'étape 2 ne suffisent pas, il faudra creuser la découpe princesse :',
  },
  'adj.bn1.sub3.steps': {
    en: '1. Pin out the excess fabric at the princess seam and measure the amount pinned.\n2. On the pattern, redraw the seam line at the exact location where you pinned the muslin, shifting it away from the original line by the width of the pinned fold, starting from the shoulder seam and stopping at the bust apex.\n3. If you pinned both the center front piece and the side front piece, correct both pieces.\n4. If you only pinned one piece, correct only the pinned side.\n5. If you also pinned at the shoulder seam, correct the pattern there as well. You will then need to adjust the back shoulder seam so that both shoulder seams match the new length.',
    fr: '1. Épinglez l\'excédent de tissu au niveau de la couture princesse et mesurez la quantité que vous avez épinglée.\n2. Sur le patron, retracez la ligne de couture à l\'endroit précis où vous avez épinglé la toile, en l\'espaçant de la ligne initiale d\'autant que la largeur de vos plis, en partant de la couture d\'épaule et en vous arrêtant au niveau du sommet de la poitrine.\n3. Si vous avez épinglé la pièce centre devant et la pièce latérale du devant, reprenez ces deux pièces.\n4. Si vous n\'avez épinglé qu\'une seule pièce, reprenez uniquement le côté épinglé.\n5. Si vous avez également épinglé à la couture d\'épaule, reprenez le patron à cet endroit. Vous devrez ensuite ajuster la couture d\'épaule du dos pour que les coutures d\'épaule du dos et du devant fassent la nouvelle longueur.',
  },
  'adj.bn1.sub3.note': {
    en: 'Don\'t forget: adjust corresponding pattern pieces such as facings and linings with the same corrections.',
    fr: 'N\'oubliez pas : ajustez les pièces de patron correspondantes comme les parementures et les doublures, avec les mêmes corrections de patron.',
  },

  'adj.bn2': { en: 'Neckline too tight around the neck', fr: 'L\'encolure est trop serrée autour du cou' },
  'adj.bn2.problem': { en: 'The neckline digs into the base of the neck, causing discomfort or leaving marks.', fr: 'L\'encolure comprime la base du cou, causant une gêne ou des marques.' },
  'adj.bn2.solution': { en: 'Increase the neckline circumference by 0.5–1 cm by lowering the front and/or back neckline depth slightly.', fr: 'Augmentez le tour d\'encolure de 0,5 à 1 cm en abaissant légèrement la profondeur d\'encolure devant et/ou dos.' },
  'adj.bn2.tip': { en: 'A tight neckline often means the neck circumference was underestimated — re-measure carefully at the base of the neck.', fr: 'Une encolure serrée signifie souvent que le tour de cou a été sous-estimé — remesurer soigneusement à la base du cou.' },

  'adj.bn3': { en: 'Back neckline stands away from the neck', fr: 'L\'encolure dos s\'écarte de la nuque' },
  'adj.bn3.intro': {
    en: 'If the back neckline floats, lifts and refuses to stay against the body, the back neckline needs to be corrected. Back neckline gaping is a common fitting issue, particularly on round necklines and boat necks.',
    fr: 'Si l\'encolure dos flotte, se soulève et refuse de rester contre le corps, il faut corriger l\'encolure dos. Le bâillement d\'encolure dos est un défaut d\'ajustement fréquent, particulièrement sur les encolures rondes et les cols bateau.',
  },
  'adj.bn3.understand': {
    en: 'Understanding the problem before correcting\n\nAs with front neckline gaping, the classic mistake is to work directly on the neckline curve. That is almost never where the real cause lies.\n\nBack neckline gaping comes from one or both of these situations:\n\n• The back neckline width is too large relative to the front neckline: the fabric has no tension to stay in place\n• A dart is missing to absorb the excess fabric in the neck/shoulder area — the case for a body shape with a flatter back than the pattern assumes\n\nThe correct method is to address the width first, then the dart if needed.',
    fr: 'Comprendre le problème avant de corriger\n\nComme pour le bâillement devant, l\'erreur classique est d\'intervenir directement sur la courbe d\'encolure. Ce n\'est presque jamais là que se trouve la vraie cause.\n\nLe bâillement dos vient de l\'une ou l\'autre de ces deux situations, parfois des deux combinées :\n\n• La largeur d\'encolure dos est trop grande par rapport à l\'encolure devant : le tissu n\'a pas de tension pour rester en place\n• Il manque une pince pour absorber l\'excès de tissu dans la zone nuque/épaule, ce qui est le cas pour une morphologie avec un dos plus plat que prévu par le patron\n\nLa méthode correcte est de traiter d\'abord la largeur, ensuite la pince si nécessaire.',
  },
  'adj.bn3.step1': {
    en: 'Step 1 – Diagnose on the muslin\n\nPin the excess at the back neckline until the fabric rests correctly. Measure the amount pinned.\n\nAlso note where the fabric rests well against the body and where it starts to float — this boundary will give the dart length if you need one later.',
    fr: 'Étape 1 – Diagnostiquer sur la toile\n\nÉpinglez l\'excès à l\'encolure dos jusqu\'à ce que le tissu repose correctement. Mesurez la quantité épinglée.\n\nNotez également où le tissu repose bien contre le corps et où il commence à flotter — cette limite donnera la longueur de pince si vous en avez besoin ultérieurement.',
  },
  'adj.bn3.step2': {
    en: 'Step 2 – Correct the neckline width\n\nAlign the front and back pattern pieces at the HSP. Compare the neckline widths.\n\nRule: the back neckline width must equal the front neckline width (accounting for closure systems). If the back is wider, the neckline must be corrected.\n\nImportant technical point: if the garment has a zip sewn at the centre back, add approximately 0.5 cm on each side (1 cm total) to the front width before comparing. An invisible zip does not require this addition as the fabrics meet without creating a gap.\n\nCorrection to make:\n\nIf the back neckline is wider than the front, reduce it by taking in the shoulder seam on the back side at the armhole (LSP). The back shoulder seam length must remain identical to the front after correction.\n\nSmooth the armhole curve so it remains continuous. Check that both shoulder lengths still match by aligning the pieces.\n\nAfter this correction: recut the back piece and do a partial fitting. In many cases, this single correction is enough. If the gaping has disappeared, there is no need to go further. If excess persists, or if the amount you pinned in step 1 was greater than what you just corrected on the width, move to the next step.',
    fr: 'Étape 2 – Corriger la largeur d\'encolure\n\nAlignez les pièces devant et dos du patron au niveau du PEH. Comparez les largeurs d\'encolure.\n\nRègle : la largeur d\'encolure dos doit être égale à la largeur d\'encolure devant (en tenant compte des systèmes de fermeture). Si le dos est plus large, il faut corriger l\'encolure.\n\nPoint technique important : si le vêtement comporte une fermeture à glissière cousue au centre dos, ajoutez environ 0,5 cm de chaque côté (1 cm au total) à la largeur devant avant de comparer. Une fermeture invisible ne nécessite pas cet ajout car les tissus se touchent sans créer d\'écart.\n\nCorrection à apporter :\n\nSi l\'encolure dos est plus large que l\'encolure devant, réduisez-la en rentrant la couture d\'épaule côté dos au niveau de l\'emmanchure (PEB). La longueur de couture d\'épaule dos doit rester identique à celle du devant après correction.\n\nRectifiez la courbe d\'emmanchure pour qu\'elle reste continue. Vérifiez que les deux longueurs d\'épaule correspondent toujours en alignant les pièces.\n\nAprès cette correction : recoupez la pièce dos et faites un essayage partiel. Dans de nombreux cas, cette seule correction suffit. Si le bâillement a disparu, inutile d\'aller plus loin. Si un excès persiste ou si la quantité que vous aviez épinglée à l\'étape 1 était supérieure à ce que vous venez de corriger sur la largeur, passez à l\'étape suivante.',
  },
  'adj.bn3.step3': {
    en: 'Step 3 – Create or deepen a dart\n\nIf gaping persists after the width correction, the remaining excess must be absorbed by a dart. This dart can be placed in two positions depending on the garment style.\n\nChoosing the dart position\n\nBack neckline dart: it starts from the neckline and points toward the centre back. Discreet and effective on round necklines.\n\nShoulder seam dart: it sits on the back shoulder seam, near the neckline. Slightly more visible but offers more freedom of integration into cut lines.\n\nPin to measure\n\nChoose the dart position and pin the muslin fabric there until the residual gaping disappears. Observe how far down the dart reaches before the fabric rests correctly — that is the dart length. Measure the pinned depth; that is the dart value to transfer to the pattern.\n\nIf you want a shoulder dart, you will probably need to open the shoulder seam to pin the back correctly. If you do not open the shoulder seam, the front may pull — this is normal when the shoulder seam is still closed.',
    fr: 'Étape 3 – Créer ou approfondir une pince\n\nSi le bâillement persiste après la correction de largeur, il faut absorber l\'excès restant par une pince. Cette pince peut se placer à deux endroits selon la coupe du vêtement.\n\nChoisir l\'emplacement de la pince\n\nPince à l\'encolure dos : elle part de la ligne d\'encolure et pointe vers le centre dos. Discrète, efficace sur les encolures rondes.\n\nPince à la couture d\'épaule : elle se place sur la couture d\'épaule dos, près de l\'encolure. Elle est légèrement plus visible mais offre plus de liberté d\'intégration dans les lignes de coupe.\n\nÉpingler pour mesurer\n\nChoisissez l\'emplacement de la pince et épinglez le tissu de la toile à cet endroit jusqu\'à ce que le bâillement résiduel disparaisse. Observez jusqu\'où descend la pince avant que le tissu repose correctement : c\'est la longueur de la pince. Mesurez la profondeur épinglée — c\'est la valeur de pince à reporter sur le patron.\n\nSi vous souhaitez une pince à l\'épaule, vous devrez probablement ouvrir la couture d\'épaule pour épingler correctement le dos. Si vous n\'ouvrez pas la couture d\'épaule, le devant risque de tirer, ce qui est normal lorsque la couture d\'épaule est encore fermée.',
  },
  'adj.bn3.step3correct': {
    en: 'Correct the pattern\n\nFor a neckline dart: mark the dart depth on the neckline and draw the dart downward to the observed length. Close the dart on the pattern (fold and fix), then smooth the neckline curve so it remains continuous once the dart is closed.\n\nFor a shoulder seam dart: the back shoulder seam becomes longer than the front once the dart is marked. So that both shoulder lengths match at assembly, add the dart value at the back LSP, then draw the dart from this new LSP inward, to the observed length. Smooth the armhole curve.',
    fr: 'Corriger le patron\n\nPour une pince à l\'encolure : marquez la profondeur de pince sur la ligne d\'encolure et tracez la pince vers le bas jusqu\'à la longueur observée. Fermez la pince sur le patron (pliez et fixez), puis rectifiez la courbe d\'encolure pour qu\'elle reste continue une fois la pince fermée.\n\nPour une pince à la couture d\'épaule : la couture d\'épaule dos devient plus longue que celle du devant une fois la pince marquée. Pour que les deux longueurs d\'épaule correspondent à l\'assemblage, ajoutez au PEB dos la valeur de pince, puis tracez la pince depuis ce nouveau PEB vers l\'intérieur, sur la longueur observée. Rectifiez la courbe d\'emmanchure.',
  },
  'adj.bn3.step4': {
    en: 'Step 4 – Integrating the dart into cut lines\n\nA neckline or shoulder dart is not an aesthetic inevitability. It can be integrated into existing or newly created cut lines:\n\n• A back yoke naturally absorbs a shoulder dart — the yoke seam line replaces the dart\n• Princess seams can integrate the correction if they pass through the relevant area\n• A collar can hide a slight back neckline dart\n\nIf you are working on a garment without these cut lines, the dart remains visible — it must then be sewn neatly and pressed toward the centre back.',
    fr: 'Étape 4 – Intégrer la pince dans les lignes de coupe\n\nUne pince à l\'encolure ou à l\'épaule n\'est pas une fatalité esthétique. Elle peut être intégrée dans des lignes de coupe existantes ou créées :\n\n• Un empiècement dos absorbe naturellement une pince d\'épaule, la ligne de couture de l\'empiècement remplaçant la pince\n• Des coutures princesses peuvent intégrer la correction si elles passent dans la zone concernée\n• Un col peut masquer une légère pince d\'encolure dos\n\nSi vous travaillez sur un vêtement sans ces lignes de coupe, la pince reste visible — elle doit alors être cousue proprement et pressée vers le centre dos.',
  },
  'adj.bn3.step5': {
    en: 'Step 5 – Validate on a new muslin\n\nRecut only the modified pieces. The back neckline should now rest naturally against the neck along its full length, without excess fabric or tension.\n\nIf a slight imperfection remains, it is generally easy to correct with a minor adjustment to the dart depth of a few millimetres.',
    fr: 'Étape 5 – Valider sur une nouvelle toile\n\nRecoupez uniquement les pièces modifiées. L\'encolure dos doit maintenant reposer naturellement contre la nuque sur toute sa longueur, sans excès de tissu ni tension.\n\nSi une légère imperfection subsiste, elle est généralement facile à corriger avec un ajustement mineur de la profondeur de pince de quelques millimètres.',
  },
  'adj.bn3.morphology': {
    en: 'What this problem says about your body shape\n\nRecurrent back neckline gaping generally indicates a flatter back than the average assumed by commercial patterns. Once identified and corrected on the basic block, the correction transfers automatically to each new project without needing to redo the diagnosis.',
    fr: 'Ce que ce problème dit de votre morphologie\n\nUn bâillement d\'encolure dos récurrent indique généralement un dos plus plat que la moyenne prévue par les patrons du commerce. Une fois identifiée et corrigée sur le patron de base, la correction se reporte automatiquement sur chaque nouveau projet sans avoir à recommencer le diagnostic.',
  },
  'adj.bn3.note': {
    en: 'Don\'t forget: adjust the corresponding pattern pieces such as facings and linings with the same pattern corrections.',
    fr: 'N\'oubliez pas : ajustez les pièces de patron correspondantes comme les parementures et les doublures, avec les mêmes corrections de patron.',
  },

  'adj.bn4': { en: 'Horizontal Draglines at the Neck', fr: 'Plis horizontaux à l\'encolure' },
  'adj.bn4.intro': {
    en: 'If horizontal wrinkles appear near the neck during fitting — on the front or the back — it is the shoulder slope of the pattern that does not match your body shape.',
    fr: 'Si à l\'essayage, des plis horizontaux apparaissent près du cou, sur le devant ou le dos, c\'est la pente d\'épaule du patron qui ne correspond pas à votre morphologie.',
  },
  'adj.bn4.understand': {
    en: 'Understanding shoulder slope\n\nA sewing pattern is built with a standard shoulder slope. But shoulders vary considerably from person to person: some are more sloping, others more square. When the pattern slope is more pronounced than yours — meaning the pattern assumes more sloping shoulders than you have — the fabric is not absorbed correctly and forms horizontal wrinkles.\n\nTwo reference points are essential to know for this correction:\n\n• HSP (High Shoulder Point): the top of the shoulder, at the neck/shoulder junction. This is the fixed point — it does not move.\n• LSP (Low Shoulder Point): the bottom of the shoulder, at the shoulder/armhole junction. This is where the correction is made.',
    fr: 'Comprendre la pente d\'épaule\n\nUn patron de couture est construit avec une pente d\'épaule standard. Or les épaules varient considérablement d\'une personne à l\'autre : certaines sont plus tombantes, d\'autres plus carrées. Quand la pente du patron est trop prononcée par rapport à la vôtre, c\'est-à-dire que le patron prévoit des épaules plus tombantes que les vôtres, le tissu n\'est pas absorbé correctement et forme des plis horizontaux.\n\nDeux points de référence sont essentiels à connaître pour cette correction :\n\n• PEH (Point d\'épaule haut) : le point haut de l\'épaule, à la jonction cou/épaule. C\'est le point fixe — on ne le bouge pas.\n• PEB (Point d\'épaule bas) : le point bas de l\'épaule, à la jonction épaule/emmanchure. C\'est là que se fait la correction.',
  },
  'adj.bn4.step1': {
    en: 'Step 1 – Confirm the diagnosis\n\nBefore touching the pattern, confirm the diagnosis on your muslin. Observe the wrinkles: they must be horizontal, starting from the neck/shoulder area, toward the front or back of the garment. If the wrinkles are diagonal or converge toward the bust, the problem is different (see the article on neckline gaping and bust adjustment).\n\nThen do the following test: with scissors, cut the shoulder seam of the muslin starting from the armhole (LSP), toward the neck — but stop before reaching the HSP. Let the seam open freely at the LSP level.\n\nIf the horizontal wrinkles disappear when the seam opens, the shoulder slope is indeed the cause. Pin the open seam in the position where the fabric falls correctly, and measure the gap opening at the LSP.\n\nAlso note whether the armhole seems too low after opening the seam, and by how much it needs to be raised — this will determine which correction option you will apply.',
    fr: 'Étape 1 – Identifier le problème avec certitude\n\nAvant de toucher au patron, confirmez le diagnostic sur votre toile. Observez les plis : ils doivent être horizontaux, partant depuis la zone cou/épaule, vers le devant ou le dos du vêtement. Si les plis sont en biais ou convergent vers la poitrine, le problème est différent (voir l\'article sur le bâillement d\'encolure et l\'ajustement poitrine).\n\nEnsuite, faites le test suivant : avec des ciseaux, coupez la couture d\'épaule de la toile en partant de l\'emmanchure (PEB), en direction du cou — mais arrêtez-vous avant d\'atteindre le PEH. Laissez la couture s\'ouvrir librement au niveau du PEB.\n\nSi les plis horizontaux disparaissent quand la couture s\'ouvre, c\'est bien la pente d\'épaule qui est en cause. Épinglez la couture ouverte dans la position où le tissu tombe correctement, et mesurez l\'écart ouvert au niveau du PEB.\n\nNotez également si l\'emmanchure vous semble trop basse après avoir ouvert la couture, et de combien la remonter — ce qui déterminera quelle option de correction vous allez appliquer.',
  },
  'adj.bn4.step2': {
    en: 'Step 2 – Correct the pattern\n\nThe correction is made by adding height to the LSP on the pattern pieces, to reduce the angle of the shoulder slope. You can correct only the front, only the back, or both, depending on where the wrinkles appeared on your muslin.\n\nOn each affected piece:\n\nStart from the LSP on the pattern. Add the value of the measured gap to the shoulder height at this point, then draw the new shoulder line connecting to the high shoulder point which does not move.\n\nAlign the front and back pieces along the shoulder seam to verify that the curves join correctly.',
    fr: 'Étape 2 – Corriger le patron\n\nLa correction se fait en ajoutant de la hauteur au PEB sur les pièces de patron, pour réduire l\'angle de la pente d\'épaule. Vous pouvez corriger uniquement le devant, le dos, ou les deux, selon l\'endroit où les plis apparaissaient sur votre toile.\n\nSur chaque pièce concernée :\n\nPartez du PEB sur le patron. Ajoutez la valeur de l\'écart mesuré à la hauteur de l\'épaule à ce point, puis tracez la nouvelle ligne d\'épaule en rejoignant le point haut de l\'épaule qui ne bouge pas.\n\nAlignez les pièces devant et dos le long de la couture d\'épaule pour vérifier que les courbes s\'assemblent correctement.',
  },
  'adj.bn4.step3intro': {
    en: 'Step 3 – Managing the enlarged armhole\n\nBy raising the LSP, the armhole is mechanically enlarged. The sleeve must now be matched to this new armhole. Two options are available to adapt the sleeve, depending on whether the armhole seemed too low after opening the seam.',
    fr: 'Étape 3 – Gérer l\'emmanchure agrandie\n\nEn relevant le PEB, on agrandit mécaniquement l\'emmanchure. Il faut maintenant faire correspondre la manche à cette nouvelle emmanchure. Deux options s\'offrent à vous pour adapter la manche à cette nouvelle emmanchure, selon si l\'emmanchure vous semblait trop basse après avoir ouvert la couture.',
  },
  'adj.bn4.optionA': {
    en: 'Option A: The armhole position is correct\n\nThe armhole is larger but its vertical position suited you. In this case, enlarge the sleeve proportionally: make a vertical slash in the sleeve cap and spread it by the value of the measured gap. Then smooth the curve of the sleeve cap.',
    fr: 'Option A : L\'emmanchure est bien placée\n\nL\'emmanchure est plus grande mais sa position verticale vous convenait. Dans ce cas, agrandissez la manche en proportion : pratiquez une incision verticale sur la tête de manche et écartez-la de la valeur de l\'écart mesuré. Rectifiez ensuite la courbe de la tête de manche.',
  },
  'adj.bn4.optionB': {
    en: 'Option B: The armhole is too low\n\nAfter raising the LSP, the armhole is positioned too low on the body. In this case, do not touch the sleeve — instead raise the side seam line of the bodice by the value of the measured gap at the armhole level. This brings the armhole back to its correct position, and the existing sleeve fits it without modification.',
    fr: 'Option B : L\'emmanchure est trop basse\n\nAprès avoir relevé le PEB, l\'emmanchure est positionnée trop bas sur le corps. Dans ce cas, ne touchez pas à la manche — remontez plutôt la ligne de côté du corsage de la valeur de l\'écart mesuré, au niveau de l\'emmanchure. Cela rehausse l\'emmanchure à sa position correcte, et l\'ancienne manche s\'y adapte sans modification.',
  },
  'adj.bn4.note': {
    en: 'Don\'t forget: adjust the corresponding pattern pieces such as facings and linings with the same pattern corrections.',
    fr: 'N\'oubliez pas : ajustez les pièces de patron correspondantes comme les parementures et les doublures, avec les mêmes corrections de patron.',
  },

  // Across Shoulder corrections
  'adj.bsh1': { en: 'Adjusting shoulder width', fr: 'Ajuster la largeur aux épaules' },
  'adj.bsh1.problem': { en: '', fr: '' },
  'adj.bsh1.solution': { en: '', fr: '' },
  'adj.bsh1.tip': { en: '', fr: '' },

  // bsh1 sub1 – Comprendre et mesurer
  'adj.bsh1.sub1': { en: 'Understanding and measuring shoulder width', fr: 'Comprendre et mesurer la largeur aux épaules' },
  'adj.bsh1.sub1.intro': {
    en: 'Knowing the correct shoulder width is essential for a well-fitting garment. Two measurements must be distinguished, as they are often given the same name depending on the source:\n\n• Full shoulder width (or shoulder span): the distance from one Low Shoulder Point (LSP) to the other, across the back. This is the full-body measurement.\n• Shoulder seam length: the distance from the High Shoulder Point (HSP) to the Low Shoulder Point (LSP) on a single shoulder. This is the half-pattern measurement.\n\nNote: each garment layer requires a different shoulder width to account for the ease of the layers worn underneath. Inner layers will have narrower measurements; outer layers (jackets, coats) will be wider.',
    fr: 'Connaître la bonne largeur aux épaules est essentiel pour obtenir un vêtement bien ajusté. Deux mesures sont à distinguer, car elles portent souvent le même nom selon les sources :\n\n• Largeur d\'épaule totale (ou largeur aux épaules) : la distance d\'un point d\'épaule basse (PEB) à l\'autre, dans le dos. C\'est la mesure du corps entier.\n• Longueur de couture d\'épaule : la distance du point d\'épaule haut (PEH) au point d\'épaule basse (PEB) sur une seule épaule. C\'est la mesure d\'une demi-pièce de patron.\n\nNote : chaque épaisseur de vêtement aura une largeur aux épaules différente afin de tenir compte des différents niveaux d\'aisance des couches portées en dessous. Les couches inférieures auront des mesures plus étroites, tandis que les couches supérieures (vestes, manteaux) auront des mesures plus larges.',
  },
  'adj.bsh1.sub1.find': {
    en: 'Finding your Low Shoulder Point (LSP)\n\n1. Locate your Low Shoulder Point (LSP) by feeling the prominent bone of the shoulder. You may need to search a little. If you have trouble locating the bone, follow your collarbone to the edge of the shoulder — the LSP is at the end of the collarbone and is slightly prominent. An alternative method: bend your elbow and rest your hand on your hip; some people can feel the bone more easily in this position.\n\n2. When you think you have found the LSP, place your finger on the tip of the bone and look at yourself in the mirror. Keeping your finger on the LSP, raise your arm to 30 degrees. If your finger does not move up or down, you have found your Low Shoulder Point. If your finger rises with the arm, you are too far out.\n\n3. Mark the outer edge of the shoulder with a washable marker at the exact point, both left and right. It is best to wear a tank top. You can also use stickers or adhesive tape and mark on those.',
    fr: 'Trouver son point le plus bas d\'épaule (PEB)\n\n1. Repérez votre point le plus bas de l\'épaule (PEB) en palpant l\'os saillant de l\'épaule. Si vous avez du mal à localiser l\'os, suivez votre clavicule jusqu\'au bord — le PEB se situe à l\'extrémité de la clavicule et est légèrement saillant. Une autre méthode : pliez le coude et posez votre main sur votre hanche. Certaines personnes sentent l\'os plus facilement dans cette position.\n\n2. Lorsque vous pensez avoir trouvé le PEB, placez votre doigt sur l\'extrémité de l\'os et regardez-vous dans le miroir. Levez le bras à 30 degrés. Si votre doigt ne monte ni ne descend, vous avez trouvé votre point. Si votre doigt monte avec le bras, vous êtes trop loin.\n\n3. Marquez le bord extérieur de l\'épaule avec un feutre lavable, à gauche et à droite. Il vaut mieux porter un débardeur.',
  },
  'adj.bsh1.sub1.measure': {
    en: 'How to measure shoulder width\n\n1. Stand in front of a mirror — I always recommend this step when taking measurements.\n2. Mark the tips of your shoulders as described above.\n3. Place a piece of adhesive tape at the end of the tape measure and stick it to one shoulder mark.\n4. Lay the tape measure across your back, along your shoulders, to the other mark.\n5. Breathe in and out deeply and relax your shoulders.\n6. Very carefully, without moving your shoulders, read the measurement. If you cannot see it, use the mirror. Do not twist your spine too much, as this would distort the result.\n7. This gives a good starting point for knit shirt shoulder width. Add 0.6 cm (¼″) ease for woven shirts. For each additional layer (sweaters, jackets, coats), add further ease to account for the bulk worn underneath.',
    fr: 'Comment mesurer sa largeur d\'épaules\n\n1. Placez-vous devant un miroir — une étape que je recommande toujours.\n2. Marquez l\'extrémité de vos épaules comme indiqué précédemment.\n3. Placez un morceau de ruban adhésif à l\'extrémité du mètre ruban et collez-le sur une marque d\'épaule.\n4. Placez le mètre ruban le long de vos épaules, dans le dos, jusqu\'à l\'autre marque.\n5. Inspirez et expirez profondément et détendez vos épaules.\n6. Très attentivement et sans bouger les épaules, regardez votre mesure. Ne tordez pas trop votre colonne vertébrale.\n7. C\'est un bon point de départ pour les chemises en maille. Ajoutez 0,6 cm (¼ po) d\'aisance pour les chemises en tissu. Pour chaque couche supplémentaire, ajoutez de l\'aisance supplémentaire.',
  },
  'adj.bsh1.sub1.note': {
    en: 'Compare this measurement to the pattern\'s shoulder width to determine how much correction is needed.',
    fr: 'Comparez cette mesure à la largeur d\'épaule du patron pour déterminer la correction à apporter.',
  },

  // bsh1 sub2 – Cas 1 : épaules trop larges
  'adj.bsh1.sub2': { en: 'Case 1 – Shoulders too wide', fr: 'Cas 1 – Les épaules sont trop larges' },
  'adj.bsh1.sub2.problem': {
    en: 'Identify the problem\n\nThe shoulder seam extends past the LSP and falls onto the upper arm. The garment appears too large in the shoulder area, sometimes with excess fabric on the front or back just below the shoulder.',
    fr: 'Identifier le problème\n\nLa couture d\'épaule dépasse le PEB et tombe sur le haut du bras. Le vêtement paraît trop grand dans la zone épaule, parfois avec un excès de tissu sur le devant ou dans le dos juste sous l\'épaule.',
  },
  'adj.bsh1.sub2.pin': {
    en: 'Pin and measure\n\nOn the muslin, pin the armhole area inward at the LSP until the shoulder seam falls exactly on the bone. Do the same front and back. Be careful not to pin the sleeve. Measure the amount pinned on each side — both sides must be equal.',
    fr: 'Épingler et mesurer\n\nSur la toile, épinglez la zone d\'emmanchure vers l\'intérieur au niveau du PEB, jusqu\'à ce que la couture d\'épaule tombe exactement sur l\'os. Faites la même chose devant et dos. Attention à ne pas épingler sur la manche. Mesurez la quantité épinglée de chaque côté — les deux côtés doivent être égaux.',
  },
  'adj.bsh1.sub2.option1': {
    en: 'Option 1 – For reductions under 1 cm per side\n\nThis option keeps the armhole and sleeve unchanged but slightly modifies the shoulder slope. It is suitable for small corrections (< 1 cm).\n\nOn the front and back pieces:\n\nDraw a straight line from a point at one-third of the shoulder seam starting from the LSP, to the armhole curve in the front/back zone. Draw a second, shorter line from the LSP to the first third of the first line.\n\nSlash along both lines without cutting all the way through, to keep the pieces connected. Overlap the pattern along the long line by the measured amount. The shoulder seam corrects itself naturally (you can open the short slit slightly).\nThe correction is the same for both front and back pieces.\n\nSmooth the armhole curve to make it continuous.\n\nThen check that front and back armholes are continuous by placing the two pieces against each other, aligning the shoulder seams. If there is a point or irregular curve, adjust accordingly.',
    fr: 'Option 1 – Pour une réduction inférieure à 1 cm de chaque côté\n\nCette option conserve l\'emmanchure et la manche sans modification, mais modifie légèrement la pente d\'épaule. Elle convient pour des corrections petites (< 1 cm).\n\nSur les pièces devant et dos :\n\nTracez une ligne droite depuis un point situé au tiers de la couture d\'épaule en partant du PEB, jusqu\'à la courbe d\'emmanchure dans la zone devant/dos. Tracez une seconde ligne plus courte depuis le PEB jusqu\'au premier tiers de la première ligne.\n\nIncisez le long des deux lignes sans couper jusqu\'au bout. Chevauchez le patron le long de la ligne longue de la quantité mesurée. La couture d\'épaule se rectifie naturellement.\nLa correction est la même pour les pièces devant et dos.\n\nRectifiez ensuite la courbe d\'emmanchure pour qu\'elle soit continue.\n\nVérifiez ensuite les emmanchures dos et devant en alignant les coutures d\'épaules. Ajustez si la courbe n\'est pas régulière.',
  },
  'adj.bsh1.sub2.option2': {
    en: 'Option 2 – For any correction (preferred method)\n\nThis option keeps the shoulder slope intact but requires a minor sleeve adjustment.\n\nOn the front and back pieces: reduce the shoulder width at the LSP by the measured amount — the LSP moves inward and becomes the new armhole. The correction tapers to zero where you stopped pinning the muslin.\n\nCheck that front and back armholes are continuous by aligning the shoulder seams.\n\nSince the armhole is now slightly larger, enlarge the sleeve cap proportionally. Measure the original and new armhole to determine the difference, and make sure the sleeve ease remains the same after correction — the sleeve cap will need to be raised by a few millimetres.',
    fr: 'Option 2 – Pour toute correction (méthode préférable)\n\nCette option conserve la pente d\'épaule intacte mais nécessite un ajustement mineur de la manche.\n\nSur les pièces devant et dos : réduisez la largeur d\'épaule au PEB de la quantité mesurée — le PEB se déplace vers l\'intérieur et devient la nouvelle emmanchure. La correction va progressivement jusqu\'à zéro là où vous avez arrêté d\'épingler la toile.\n\nVérifiez ensuite les emmanchures dos et devant en alignant les coutures d\'épaules.\n\nL\'emmanchure étant maintenant légèrement plus grande, agrandissez la tête de manche en proportion. Mesurez l\'emmanchure originale et la nouvelle pour déterminer la différence, et assurez-vous que l\'aisance de manche reste identique après correction. Il faudra relever la tête de manche de quelques millimètres.',
  },
  'adj.bsh1.sub2.note': {
    en: 'Don\'t forget: adjust the corresponding pattern pieces such as facings and linings with the same corrections.',
    fr: 'N\'oubliez pas : ajustez les pièces de patron correspondantes comme les parementures et les doublures, avec les mêmes corrections de patron.',
  },

  // bsh1 sub3 – Cas 2 : épaules trop étroites
  'adj.bsh1.sub3': { en: 'Case 2 – Shoulders too narrow', fr: 'Cas 2 – Les épaules sont trop étroites' },
  'adj.bsh1.sub3.problem': {
    en: 'Identify the problem\n\nThis is also called a broad-shoulder adjustment. The shoulder seam does not reach the LSP — it stops too soon, on the upper shoulder. The garment pulls, the armhole rides up, and horizontal drag lines may appear on the front or back just below the shoulder.',
    fr: 'Identifier le problème\n\nOn appelle également cela un ajustement pour épaules larges. La couture d\'épaule ne descend pas jusqu\'au PEB : elle s\'arrête trop tôt, sur le haut de l\'épaule. Le vêtement tire, l\'emmanchure remonte, et des tiraillements horizontaux peuvent apparaître dans la zone devant ou dos juste sous l\'épaule.',
  },
  'adj.bsh1.sub3.cut': {
    en: 'Slash and measure\n\nOn the muslin, slash the armhole at the LSP until the shoulder seam falls correctly on the shoulder. Spread the slash, hold it with adhesive tape and measure the gap. Move your arm carefully to feel the sleeve and shoulder movement — you should be able to move comfortably.\nDo the same front and back.',
    fr: 'Couper et mesurer\n\nSur la toile, incisez l\'emmanchure au niveau du PEB jusqu\'à ce que la couture d\'épaule tombe correctement sur l\'épaule. Écartez l\'incision, fixez-la avec du ruban adhésif et mesurez l\'écart. Déplacez votre bras avec précaution pour sentir le mouvement de la manche et de l\'épaule. Vous devriez pouvoir bouger confortablement.\nFaites la même chose devant et dos.',
  },
  'adj.bsh1.sub3.option1': {
    en: 'Option 1 – For additions under 1 cm per side\n\nDraw a straight line from a point at one-third of the shoulder seam starting from the LSP, to the armhole curve in the front/back zone. Draw a second, shorter line from the LSP to the first third of the first line.\n\nSlash along both lines without cutting all the way through. Spread the pattern pieces apart by the measured amount — this lengthens the shoulder seam (you can overlap the two created sections slightly).\nThe correction is the same for front and back. Redraw the shoulder seam so it is straight.\n\nSmooth the armhole curve. The sleeve does not need modification in this option as the armhole length remains the same.\n\nCheck that front and back armholes are continuous by aligning the shoulder seams. Adjust if the curve is not regular.',
    fr: 'Option 1 – Pour un agrandissement inférieur à 1 cm de chaque côté\n\nTracez une ligne droite depuis un point situé au tiers de la couture d\'épaule en partant du PEB, jusqu\'à la courbe d\'emmanchure dans la zone devant/dos. Tracez une seconde ligne plus courte depuis le PEB jusqu\'au premier tiers de la première ligne.\n\nIncisez le long des deux lignes sans couper jusqu\'au bout. Écartez les pièces du patron de la quantité mesurée — vous allongez ainsi la couture d\'épaule.\nLa correction est la même pour les pièces devant et dos. Retracez la couture d\'épaule pour qu\'elle soit droite.\n\nRectifiez la courbe d\'emmanchure. La manche ne nécessite pas de modification dans cette option car l\'emmanchure reste de même longueur.\n\nVérifiez ensuite les emmanchures dos et devant en alignant les coutures d\'épaules.',
  },
  'adj.bsh1.sub3.option2': {
    en: 'Option 2 – For any correction (preferred method)\n\nOn the front and back pieces: increase the shoulder width at the LSP by the measured amount. The armhole is now slightly smaller. Adjust the sleeve cap accordingly by slashing the sleeve to reduce its length and match the new armhole. Maintain the same ease as the original.\n\nCheck that front and back armholes are continuous by aligning the shoulder seams.\n\nSince the armhole is now smaller, adapt the sleeve cap: slash and close (overlap) the pattern by the amount needed to match the new armhole.\n\nTip: before correcting, measure the original armhole and sleeve seam to determine the original ease. After correcting, you must obtain the same ease on the sleeve relative to the new armhole.',
    fr: 'Option 2 – Pour toute correction (méthode préférable)\n\nSur les pièces devant et dos : agrandissez la largeur d\'épaule au PEB de la quantité mesurée. L\'emmanchure est maintenant légèrement plus petite. Ajustez la tête de manche en conséquence en incisant la manche pour réduire sa longueur et correspondre à la nouvelle emmanchure. Conservez la même aisance qu\'à l\'origine.\n\nVérifiez ensuite les emmanchures dos et devant en alignant les coutures d\'épaules.\n\nL\'emmanchure étant désormais plus petite, adaptez la tête de manche : coupez et fermez en superposant le patron de la mesure nécessaire.\n\nConseil : avant la correction, mesurez l\'emmanchure et la couture de manche d\'origine pour déterminer l\'aisance. Après la correction, vous devez obtenir la même aisance sur la manche par rapport à la nouvelle emmanchure.',
  },
  'adj.bsh1.sub3.note': {
    en: 'Don\'t forget: adjust the corresponding pattern pieces such as facings and linings with the same corrections.',
    fr: 'N\'oubliez pas : ajustez les pièces de patron correspondantes comme les parementures et les doublures, avec les mêmes corrections de patron.',
  },
  'adj.bsh1.sub3.morphology': {
    en: 'What this problem says about your body shape\n\nShoulder width is a stable morphological measurement that changes little over time. Once your measurement is established and the difference from commercial patterns is identified, you can apply this correction systematically to each new project without redoing the diagnosis.',
    fr: 'Ce que ce problème dit de votre morphologie\n\nLa largeur d\'épaule est une mesure morphologique stable qui varie peu dans le temps. Une fois votre mesure établie et l\'écart avec les patrons du commerce identifié, vous pourrez reporter cette correction systématiquement sur chaque nouveau projet sans refaire le diagnostic.',
  },

  'adj.bsh2': { en: 'Shoulder seam pulls toward the front', fr: 'La couture d\'épaule tire vers l\'avant' },
  'adj.bsh2.problem': { en: 'The shoulder seam shifts forward off the shoulder ridge, revealing more back than front at the shoulder.', fr: 'La couture d\'épaule glisse vers l\'avant de la crête de l\'épaule, laissant plus de dos que de devant visible.' },
  'adj.bsh2.solution': { en: 'Increase the back shoulder slope slightly or raise the back shoulder height. Rotate the back bodice piece to move the seam balance point rearward.', fr: 'Augmentez légèrement la pente d\'épaule dos ou rehaussez la hauteur d\'épaule dos. Faites pivoter le dos pour déplacer le point d\'équilibre de la couture vers l\'arrière.' },
  'adj.bsh2.tip': { en: 'This is often linked to a forward shoulder posture — note it when taking measurements.', fr: 'Ce problème est souvent lié à une posture d\'épaules portées en avant — notez-le lors de la prise de mesures.' },

  'adj.bsh3': { en: 'Diagonal wrinkles from neckline toward shoulder', fr: 'Plis diagonaux de l\'encolure vers l\'épaule' },
  'adj.bsh3.problem': { en: 'Diagonal drag lines run from the neckline toward the shoulder point, indicating the shoulder slope doesn\'t match the body.', fr: 'Des plis diagonaux partent de l\'encolure vers la pointe d\'épaule, indiquant que la pente d\'épaule ne correspond pas au corps.' },
  'adj.bsh3.solution': { en: 'Adjust the shoulder slope angle. If wrinkles point upward toward the neck, increase the slope (lower the shoulder tip). If pointing downward, decrease the slope.', fr: 'Ajustez l\'angle de pente d\'épaule. Si les plis pointent vers le haut (encolure), augmentez la pente (abaissez la pointe d\'épaule). S\'ils pointent vers le bas, diminuez la pente.' },
  'adj.bsh3.tip': { en: 'Shoulder slope varies significantly between individuals — always check on a muslin before cutting the final fabric.', fr: 'La pente d\'épaule varie beaucoup d\'une personne à l\'autre — vérifiez toujours sur une toile avant de couper le tissu définitif.' },

  'adj.bsh4': { en: 'Shoulders too narrow, pulling across the upper chest', fr: 'Épaules trop étroites, tirant sur la poitrine haute' },
  'adj.bsh4.problem': { en: 'The pattern is too narrow across the shoulders, causing horizontal tightness and pulling at the armhole.', fr: 'Le patron est trop étroit aux épaules, causant une tension horizontale et tirant au niveau de l\'emmanchure.' },
  'adj.bsh4.solution': { en: 'Increase the shoulder length measurement. Also check the across front (carrure devant) since both contribute to upper chest width.', fr: 'Augmentez la mesure de longueur d\'épaule. Vérifiez aussi la carrure devant car les deux contribuent à la largeur du haut de la poitrine.' },
  'adj.bsh4.tip': { en: 'Increase by 0.5 cm increments and re-check — small changes at the shoulder have a big visual impact.', fr: 'Augmentez par tranches de 0,5 cm et revérifiez — les petits changements à l\'épaule ont un grand impact visuel.' },

  // Across Front & Back corrections
  'adj.bafb1': { en: 'Too tight across the upper chest (across front)', fr: 'Trop serré sur la carrure devant' },
  'adj.bafb1.problem': { en: 'Horizontal drag lines appear across the upper front between the armholes, restricting arm movement.', fr: 'Des plis horizontaux apparaissent sur le haut du devant entre les emmanchures, limitant les mouvements du bras.' },
  'adj.bafb1.solution': { en: 'Increase the across front (carrure devant) measurement by 0.5–1 cm. This widens the front armhole curve and relieves the tension.', fr: 'Augmentez la carrure devant de 0,5 à 1 cm. Cela élargit la courbe d\'emmanchure devant et libère la tension.' },
  'adj.bafb1.tip': { en: 'Across front is measured 13 cm below the base of the neck across the chest — confirm your measuring point.', fr: 'La carrure devant se mesure 13 cm sous la base du cou en travers de la poitrine — confirmez votre point de mesure.' },

  'adj.bafb2': { en: 'Diagonal draglines from armhole toward the bust', fr: 'Plis diagonaux de l\'emmanchure vers la poitrine' },
  'adj.bafb2.problem': { en: 'Fabric pulls diagonally from the underarm toward the bust point, indicating the front width is too narrow or the dart placement is off.', fr: 'Le tissu tire en diagonale depuis le dessous de bras vers la pointe de poitrine, indiquant que le devant est trop étroit ou que la pince est mal placée.' },
  'adj.bafb2.solution': { en: 'Check the across front measurement and increase if needed. Also verify that the bust dart points toward the true apex. Rotate or relocate the dart if necessary.', fr: 'Vérifiez la carrure devant et augmentez-la si nécessaire. Assurez-vous que la pince de poitrine pointe vers le vrai apex. Faites pivoter ou déplacez la pince si nécessaire.' },
  'adj.bafb2.tip': { en: 'Diagonal front draglines usually have two causes — width and dart placement — address them separately on the muslin.', fr: 'Les plis diagonaux devant ont souvent deux causes — largeur et placement de pince — traitez-les séparément sur la toile.' },

  'adj.bafb3': { en: 'Too tight across the upper back (across back)', fr: 'Trop serré sur la carrure dos' },
  'adj.bafb3.problem': { en: 'Horizontal pulling or tightness across the upper back between the shoulder blades restricts arm and shoulder movement.', fr: 'Une tension horizontale entre les omoplates dans le haut du dos limite les mouvements des bras et des épaules.' },
  'adj.bafb3.solution': { en: 'Increase the across back (carrure dos) measurement. Widen the back armhole curve accordingly, keeping the shoulder length unchanged.', fr: 'Augmentez la carrure dos. Élargissez la courbe d\'emmanchure dos en conséquence, sans modifier la longueur d\'épaule.' },
  'adj.bafb3.tip': { en: 'Across back is measured 17 cm below the nape across the back — confirm your reference point.', fr: 'La carrure dos se mesure 17 cm sous la nuque en travers du dos — confirmez votre point de référence.' },

  'adj.bafb4': { en: 'Too wide across the back, excess fabric', fr: 'Trop large dans le dos, tissu en excès' },
  'adj.bafb4.problem': { en: 'The back panel is baggy between the shoulder blades, with vertical or diagonal folds of excess fabric.', fr: 'Le dos est flottant entre les omoplates, avec des plis verticaux ou diagonaux de tissu en excès.' },
  'adj.bafb4.solution': { en: 'Reduce the across back measurement. Take in the back armhole curve inward and/or reduce the back ease.', fr: 'Réduisez la carrure dos. Rentrez la courbe d\'emmanchure dos vers l\'intérieur et/ou réduisez l\'aisance dos.' },
  'adj.bafb4.tip': { en: 'Try pinching out the excess fabric on the muslin to find the ideal reduction amount before modifying the pattern.', fr: 'Essayez de pincer le tissu en excès sur la toile pour trouver la valeur de réduction idéale avant de modifier le patron.' },

  // Armhole & Raglan corrections
  'adj.bar1': { en: 'Armhole too deep at the underarm', fr: 'Emmanchure trop profonde sous le bras' },
  'adj.bar1.problem': { en: 'The armhole drops too low under the arm, causing fabric to bunch or restricting free movement.', fr: 'L\'emmanchure descend trop bas sous le bras, causant des fronces ou limitant les mouvements.' },
  'adj.bar1.solution': { en: 'Raise the underarm point on the armhole curve. Check that the armhole depth measurement isn\'t too large relative to your body.', fr: 'Remontez le point du dessous de bras sur la courbe d\'emmanchure. Vérifiez que la profondeur d\'emmanchure n\'est pas trop grande par rapport à votre morphologie.' },
  'adj.bar1.tip': { en: 'A standard fitted armhole sits about 2–3 cm below the armpit — adjust from that baseline.', fr: 'Une emmanchure ajustée standard se trouve à environ 2 à 3 cm sous l\'aisselle — ajustez à partir de cette référence.' },

  'adj.bar2': { en: 'Armhole too tight, restricting arm movement', fr: 'Emmanchure trop serrée, limitant les mouvements du bras' },
  'adj.bar2.problem': { en: 'The armhole circumference is too small, pulling or binding when the arm is raised or moved forward.', fr: 'Le tour d\'emmanchure est trop petit, tirant ou coinçant lorsque le bras est levé ou avancé.' },
  'adj.bar2.solution': { en: 'Increase the armhole depth slightly to enlarge the circumference. Widening both across front and across back will also naturally open the armhole.', fr: 'Augmentez légèrement la profondeur d\'emmanchure pour agrandir le tour. Élargir la carrure devant et la carrure dos agrandira aussi naturellement l\'emmanchure.' },
  'adj.bar2.tip': { en: 'For fitted woven garments, allow 3–4 cm of ease around the armhole circumference.', fr: 'Pour les vêtements ajustés en tissu tissé, prévoyez 3 à 4 cm d\'aisance autour du tour d\'emmanchure.' },

  'adj.bar3': { en: 'Raglan sleeve pulls at the neckline', fr: 'La manche raglan tire à l\'encolure' },
  'adj.bar3.problem': { en: 'The raglan seam pulls upward toward the neck when the arm hangs down, creating visible tension at the neckline.', fr: 'La couture raglan tire vers le haut en direction du cou lorsque le bras est baissé, créant une tension visible à l\'encolure.' },
  'adj.bar3.solution': { en: 'Increase the raglan sleeve length from shoulder to underarm. Also check that the raglan seam sits on the shoulder ridge rather than behind it.', fr: 'Augmentez la longueur de la manche raglan de l\'épaule au dessous de bras. Vérifiez aussi que la couture raglan est bien positionnée sur la crête de l\'épaule et non derrière.' },
  'adj.bar3.tip': { en: 'Raglan seams are harder to fit than set-in sleeves — always make a full muslin before cutting the final fabric.', fr: 'Les manches raglan sont plus difficiles à ajuster que les manches montées — faites toujours une toile complète avant de couper le tissu définitif.' },

  'adj.bar4': { en: 'Armhole too large, sleeve falls off the shoulder', fr: 'Emmanchure trop grande, la manche glisse de l\'épaule' },
  'adj.bar4.problem': { en: 'The armhole opening is too wide, causing the sleeve to slip off the shoulder point.', fr: 'L\'ouverture d\'emmanchure est trop large, ce qui fait glisser la manche hors de la pointe d\'épaule.' },
  'adj.bar4.solution': { en: 'Reduce the armhole depth to tighten the circumference. Bring in the armhole curve from the shoulder side, keeping the underarm point intact.', fr: 'Réduisez la profondeur d\'emmanchure pour diminuer le tour. Rentrez la courbe d\'emmanchure du côté épaule, en conservant le point du dessous de bras.' },
  'adj.bar4.tip': { en: 'If the sleeve also falls backward, check the front-to-back balance of the shoulder seam.', fr: 'Si la manche glisse aussi vers l\'arrière, vérifiez l\'équilibre devant-dos de la couture d\'épaule.' },

  // Set-in Sleeve corrections
  'adj.bsl1': { en: 'Sleeve cap puckers — too much ease', fr: 'La tête de manche fronce — trop d\'embu' },
  'adj.bsl1.problem': { en: 'Excess fullness at the sleeve cap creates puckers that won\'t ease in smoothly when setting the sleeve.', fr: 'Un excès de tissu à la tête de manche crée des fronces qui ne s\'incorporent pas uniformément lors du montage.' },
  'adj.bsl1.solution': { en: 'Reduce the sleeve cap height slightly, which will reduce cap ease. Check the armhole circumference — a smaller armhole requires less ease.', fr: 'Réduisez légèrement la hauteur de la tête de manche pour diminuer l\'embu. Vérifiez le tour d\'emmanchure — une emmanchure plus petite nécessite moins d\'embu.' },
  'adj.bsl1.tip': { en: 'Sleeve cap ease should be 3–5 cm for woven fabrics and 0–2 cm for stretch knits.', fr: 'L\'embu de tête de manche doit être de 3 à 5 cm pour les tissus tissés et de 0 à 2 cm pour les mailles extensibles.' },

  'adj.bsl2': { en: 'Sleeve cap pulls — not enough ease', fr: 'La tête de manche tire — pas assez d\'embu' },
  'adj.bsl2.problem': { en: 'The sleeve cap is too flat or short to fit the armhole smoothly, causing pulling at the shoulder.', fr: 'La tête de manche est trop plate ou trop courte pour s\'ajuster à l\'emmanchure, causant des tensions à l\'épaule.' },
  'adj.bsl2.solution': { en: 'Increase the sleeve cap height by 0.5–1 cm increments. This adds cap ease and allows the cap to curve over the shoulder naturally.', fr: 'Augmentez la hauteur de la tête de manche par tranches de 0,5 à 1 cm. Cela ajoute de l\'embu et permet à la tête de manche d\'arrondir naturellement sur l\'épaule.' },
  'adj.bsl2.tip': { en: 'Walk the sleeve cap around the armhole on paper to check that ease is evenly distributed front and back.', fr: 'Faites rouler la tête de manche autour de l\'emmanchure sur papier pour vérifier que l\'embu est bien réparti devant et dos.' },

  'adj.bsl3': { en: 'Sleeve twists forward or backward', fr: 'La manche tourne vers l\'avant ou l\'arrière' },
  'adj.bsl3.problem': { en: 'When the arm hangs naturally, the sleeve rotates forward or backward instead of hanging plumb.', fr: 'Lorsque le bras pend naturellement, la manche tourne vers l\'avant ou l\'arrière au lieu de tomber droit.' },
  'adj.bsl3.solution': { en: 'Re-align the sleeve by adjusting the notch positions on the cap. Shifting notches backward rotates the sleeve forward; shifting forward rotates it back.', fr: 'Réalignez la manche en déplaçant les crans sur la tête de manche. Déplacer les crans vers l\'arrière fait tourner la manche vers l\'avant, et inversement.' },
  'adj.bsl3.tip': { en: 'Front and back cap lengths should match their respective armhole halves — check balance marks carefully.', fr: 'Les longueurs avant et arrière de la tête de manche doivent correspondre aux moitiés de l\'emmanchure — vérifiez soigneusement les crans.' },

  'adj.bsl4': { en: 'Sleeve too tight at the upper arm', fr: 'La manche est trop serrée au biceps' },
  'adj.bsl4.problem': { en: 'The sleeve grips the upper arm, creating horizontal wrinkles and restricting movement.', fr: 'La manche comprime le haut du bras, créant des plis horizontaux et limitant les mouvements.' },
  'adj.bsl4.solution': { en: 'Increase the upper arm circumference measurement by 1–2 cm. Widen the sleeve at the bicep line without changing the cap shape.', fr: 'Augmentez le tour de bras de 1 à 2 cm. Élargissez la manche au niveau du biceps sans modifier la forme de la tête de manche.' },
  'adj.bsl4.tip': { en: 'Measure the upper arm both relaxed and flexed — use the larger value plus ease.', fr: 'Mesurez le tour de bras détendu et fléchi — utilisez la valeur la plus grande plus l\'aisance.' },

  // Bust corrections
  'adj.bbu1': { en: 'Bust too tight — horizontal wrinkles across the chest', fr: 'Poitrine trop serrée — plis horizontaux sur la poitrine' },
  'adj.bbu1.problem': { en: 'Horizontal tightness across the bust with fabric pulling at the side seams and armholes.', fr: 'Tension horizontale sur la poitrine avec le tissu qui tire aux coutures de côté et aux emmanchures.' },
  'adj.bbu1.solution': { en: 'Increase the bust measurement. Allow a minimum of 4–6 cm of ease for woven fabrics. Check that the dart intake is matched to your cup size.', fr: 'Augmentez la mesure de tour de poitrine. Prévoyez au minimum 4 à 6 cm d\'aisance pour les tissus tissés. Vérifiez que la valeur de pince correspond à votre bonnet.' },
  'adj.bbu1.tip': { en: 'Measure over a well-fitted bra at the fullest point of the bust — not too loose, not too tight.', fr: 'Mesurez avec un soutien-gorge bien ajusté au point le plus fort de la poitrine — ni trop lâche, ni trop serré.' },

  'adj.bbu2': { en: 'Diagonal wrinkles pointing toward the bust apex', fr: 'Plis diagonaux pointant vers la pointe de poitrine' },
  'adj.bbu2.problem': { en: 'Drag lines radiate toward the bust apex from the armhole or side seam, indicating the bust dart doesn\'t align with the apex.', fr: 'Des plis rayonnent vers la pointe de poitrine depuis l\'emmanchure ou la couture de côté, indiquant que la pince de poitrine n\'est pas alignée avec l\'apex.' },
  'adj.bbu2.solution': { en: 'Re-position the bust dart so its point aims directly at the bust apex. The dart tip should stop 1.5–2.5 cm before the apex.', fr: 'Repositionnez la pince de poitrine pour que sa pointe vise directement l\'apex. La pointe de pince doit s\'arrêter à 1,5–2,5 cm de l\'apex.' },
  'adj.bbu2.tip': { en: 'Mark your bust apex carefully on the muslin before drawing the dart — it should be at the fullest point.', fr: 'Marquez soigneusement votre apex sur la toile avant de tracer la pince — il doit être au point le plus saillant.' },

  'adj.bbu3': { en: 'Horizontal wrinkles below the bust', fr: 'Plis horizontaux sous la poitrine' },
  'adj.bbu3.problem': { en: 'Fabric buckles horizontally just below the bustline, suggesting the bodice is too long above the waist or the dart intake is too large.', fr: 'Le tissu se plisse horizontalement juste sous la ligne de poitrine, indiquant que le corsage est trop long au-dessus de la taille ou que la pince est trop grande.' },
  'adj.bbu3.solution': { en: 'Check the front bodice length and reduce if needed. If the dart is too deep, reduce the intake — excess dart intake creates a conical shape below the bust.', fr: 'Vérifiez la longueur devant du corsage et réduisez-la si nécessaire. Si la pince est trop profonde, réduisez sa valeur — un excès de pince crée une forme conique sous la poitrine.' },
  'adj.bbu3.tip': { en: 'Front bodice length (shoulder to waist through the bust) must be checked on a muslin, not estimated from a size chart.', fr: 'La longueur devant (épaule à taille en passant par la poitrine) doit être vérifiée sur une toile, pas estimée depuis un tableau de tailles.' },

  'adj.bbu4': { en: 'Bust dart too large or too small', fr: 'La pince de poitrine est trop grande ou trop petite' },
  'adj.bbu4.problem': { en: 'The dart doesn\'t create enough shaping for a full bust, or creates too much shaping for a flatter chest.', fr: 'La pince ne crée pas assez de galbe pour une forte poitrine, ou en crée trop pour une poitrine plate.' },
  'adj.bbu4.solution': { en: 'Adjust the dart intake based on cup size. Each cup size roughly equals 1.5–2.5 cm of dart intake. Redistribute excess intake into style seams if needed.', fr: 'Ajustez la valeur de pince selon le bonnet. Chaque taille de bonnet représente environ 1,5 à 2,5 cm de valeur de pince. Redistribuez l\'excédent dans des coutures de style si nécessaire.' },
  'adj.bbu4.tip': { en: 'Dart intake is determined by the difference between the high bust and full bust measurements.', fr: 'La valeur de pince est déterminée par la différence entre le tour de buste (sous la poitrine) et le tour de poitrine.' },

  // Back Draglines & Hemline corrections
  'adj.bbdh1': { en: 'Back length too long or too short', fr: 'Longueur dos trop longue ou trop courte' },
  'adj.bbdh1.problem': { en: 'The bodice waistline doesn\'t align with the natural waist — it rides up or drops down at the back.', fr: 'La ligne de taille du corsage ne correspond pas à la taille naturelle — elle remonte ou descend dans le dos.' },
  'adj.bbdh1.solution': { en: 'Adjust the back length (longueur taille-dos) measurement by the exact difference between your measured waist and the pattern waistline.', fr: 'Ajustez la longueur taille-dos de la différence exacte entre votre taille mesurée et la ligne de taille du patron.' },
  'adj.bbdh1.tip': { en: 'Measure from the prominent bone at the nape straight down to an elastic tied at the natural waist.', fr: 'Mesurez depuis l\'os saillant à la nuque en ligne droite jusqu\'à un élastique noué à la taille naturelle.' },

  'adj.bbdh2': { en: 'Diagonal draglines at the back', fr: 'Plis diagonaux au dos' },
  'adj.bbdh2.problem': { en: 'Diagonal drag lines run from the shoulder blade area or along the center back seam, caused by sway back, rounded back, or incorrect length.', fr: 'Des plis diagonaux partent de la zone des omoplates ou le long du milieu dos, causés par un dos creux, un dos rond ou une longueur incorrecte.' },
  'adj.bbdh2.solution': { en: 'For sway back (hollow lower back): take in the center back seam at waist level, tapering to nothing at side seams. For rounded back: add a horizontal tuck above the waist to add length. Test on a muslin before cutting.', fr: 'Pour un dos creux : rentrez la couture milieu dos au niveau de la taille en dégradant jusqu\'aux coutures de côté. Pour un dos rond : ajoutez un pli horizontal au-dessus de la taille pour ajouter de la longueur. Testez sur une toile avant de couper.' },
  'adj.bbdh2.tip': { en: 'Wrinkles pointing up-inward toward the waist = sway back. Pointing outward-down = rounded back.', fr: 'Plis pointant vers le haut et l\'intérieur (taille) = dos creux. Pointant vers l\'extérieur et le bas = dos rond.' },

  'adj.bbdh3': { en: 'Hemline uneven front to back', fr: 'Ourlet inégal devant-dos' },
  'adj.bbdh3.problem': { en: 'The bodice hemline doesn\'t sit level all around — it dips at the front or the back.', fr: 'L\'ourlet du corsage ne tombe pas droit — il descend devant ou derrière.' },
  'adj.bbdh3.solution': { en: 'If the hem dips at the back, lengthen the back length. If at the front, check the front bodice length (shoulder to waist through the bust) and adjust independently.', fr: 'Si l\'ourlet descend derrière, rallongez la longueur dos. Si c\'est devant, vérifiez la longueur devant (épaule à taille en passant par la poitrine) et ajustez indépendamment.' },
  'adj.bbdh3.tip': { en: 'Use a dress form or ask someone to help check hemline levelness — it\'s impossible to check accurately on yourself.', fr: 'Utilisez un mannequin de couture ou faites-vous aider pour vérifier le niveau de l\'ourlet — impossible à vérifier seule.' },

  'adj.bbdh4': { en: 'Excess fabric pouch at the lower back', fr: 'Excès de tissu en poche dans le bas du dos' },
  'adj.bbdh4.problem': { en: 'Horizontal folds or pouching of fabric appear at the lower back above the waistline, a classic sign of sway back.', fr: 'Des plis horizontaux ou une poche de tissu apparaissent dans le bas du dos au-dessus de la ligne de taille — signe classique d\'un dos creux.' },
  'adj.bbdh4.solution': { en: 'Take in a horizontal tuck at center back, tapering to nothing at the side seams. The tuck amount equals the depth of the excess fold.', fr: 'Faites un pli horizontal au milieu dos, en dégradant jusqu\'à rien aux coutures de côté. La valeur du pli est égale à la profondeur du pli de tissu en excès.' },
  'adj.bbdh4.tip': { en: 'A sway back tuck of 1–2 cm at center back resolves most cases — always test on a muslin first.', fr: 'Un pli dos creux de 1 à 2 cm au milieu dos résout la plupart des cas — testez toujours sur une toile d\'abord.' },

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

  // Pants sub-categories
  'adj.pants.selectSection': { en: 'Select a correction section.', fr: 'Sélectionnez une section de corrections.' },
  'adj.pants.sub.balance': { en: 'Pattern Balance', fr: 'Équilibre du patron' },
  'adj.pants.sub.frontRise': { en: 'Front Rise Corrections', fr: 'Corrections du montant avant' },
  'adj.pants.sub.backDraglines': { en: 'Back Draglines & Creases', fr: 'Faux plis & plis au dos' },
  'adj.pants.sub.pocketsLeg': { en: 'Pockets & Lower Leg', fr: 'Poches & bas de jambe' },

  // Pattern Balance
  'adj.pb1': { en: 'The Difference between Trousers, Slacks, and Jeans', fr: 'La différence entre pantalons, slacks et jeans' },
  'adj.pb1.problem': { en: 'Unsure which pants type to draft — each style requires different ease and crotch shaping.', fr: 'Pas sûr quel type de pantalon tracer — chaque style nécessite une aisance et une forme d\'entrejambe différentes.' },
  'adj.pb1.solution': { en: 'Trousers are tailored with 3–4 cm of hip ease and a pressed crease. Slacks are casual with 4–6 cm ease and a softer drape. Jeans are drafted for rigid denim with minimal ease (1–2 cm) and a lower back rise to compensate for the fabric\'s lack of give.', fr: 'Les pantalons habillés ont 3 à 4 cm d\'aisance aux hanches et un pli repassé. Les slacks sont décontractés avec 4 à 6 cm d\'aisance. Les jeans sont tracés pour le denim rigide avec une aisance minimale (1 à 2 cm) et un montant dos plus bas pour compenser le manque d\'extensibilité du tissu.' },
  'adj.pb1.tip': { en: 'The ease amount directly affects crotch depth and hip width — decide on the intended style before taking measurements.', fr: 'L\'aisance affecte directement la profondeur d\'entrejambe et la largeur de hanches — décidez du style visé avant de prendre les mesures.' },

  'adj.pb2': { en: 'A Balanced Pants Pattern', fr: 'Un patron de pantalon équilibré' },
  'adj.pb2.problem': { en: 'The pants hang crooked or twist when worn, even before any fit corrections are attempted.', fr: 'Le pantalon tombe de travers ou tourne lorsqu\'on le porte, même avant toute correction.' },
  'adj.pb2.solution': { en: 'A balanced pattern has the grain line running straight down the leg from hip to hem, the side seam hanging plumb, and ease distributed evenly front and back. Confirm the crotch depth is correct and both front and back rise lengths suit the wearer.', fr: 'Un patron équilibré a le droit fil descendant droit de la hanche à l\'ourlet, la couture de côté tombant à plomb et l\'aisance répartie également devant et dos. Vérifiez que la profondeur d\'entrejambe est correcte et que les montants devant et dos conviennent.' },
  'adj.pb2.tip': { en: 'Always check balance on a muslin first — an imbalanced pattern makes every other correction misleading.', fr: 'Vérifiez toujours l\'équilibre sur une toile d\'abord — un patron déséquilibré rend toutes les autres corrections trompeuses.' },

  'adj.pb3': { en: 'Correcting an Unbalanced Pants Pattern', fr: 'Corriger un patron de pantalon déséquilibré' },
  'adj.pb3.problem': { en: 'The pants twist toward the front or back, with the side seams spinning out of plumb when worn.', fr: 'Le pantalon tourne vers l\'avant ou l\'arrière, les coutures de côté déviant de la verticale lorsqu\'il est porté.' },
  'adj.pb3.solution': { en: 'For forward twist: take in the back side seam and let out the front side seam by equal amounts. For backward twist: reverse the adjustments. Work in 0.5 cm increments and recheck balance after each change. Also inspect the crotch curves — an incorrectly shaped crotch curve often causes twist.', fr: 'Pour une torsion vers l\'avant : rentrez la couture de côté dos et élargissez la couture de côté devant de la même valeur. Pour une torsion vers l\'arrière : inversez les corrections. Travaillez par tranches de 0,5 cm et revérifiez l\'équilibre à chaque fois. Inspectez aussi les courbes d\'entrejambe car une courbe mal tracée cause souvent la torsion.' },
  'adj.pb3.tip': { en: 'Twist at the leg is often linked to an incorrect crotch curve — address both issues together on the muslin.', fr: 'La torsion de la jambe est souvent liée à une courbe d\'entrejambe incorrecte — traitez les deux problèmes ensemble sur la toile.' },

  // Front Rise corrections
  'adj.pfr1': { en: 'Acceptable Front Wrinkles', fr: 'Plis acceptables au montant avant' },
  'adj.pfr1.problem': { en: 'Small diagonal or curved wrinkles appear near the front crotch seam but the pants are comfortable and functional.', fr: 'De petits plis diagonaux ou courbes apparaissent près de la couture du montant avant, mais le pantalon est confortable et fonctionnel.' },
  'adj.pfr1.solution': { en: 'Minor front wrinkles are considered acceptable when they are subtle and cause no discomfort. Individual body shape variations — such as a prominent abdomen or a flatter front — create slight wrinkling that is difficult to eliminate entirely. Evaluate whether correction is worth the effort.', fr: 'De petits plis devant sont considérés comme acceptables lorsqu\'ils sont discrets et ne causent aucune gêne. Les variations individuelles de morphologie — comme un ventre proéminent ou un devant plus plat — créent des plis légers difficiles à éliminer entièrement. Évaluez si la correction vaut l\'effort.' },
  'adj.pfr1.tip': { en: 'If the wrinkles don\'t bother you aesthetically and the fit is comfortable, no correction is necessary.', fr: 'Si les plis ne vous gênent pas esthétiquement et que l\'ajustement est confortable, aucune correction n\'est nécessaire.' },

  'adj.pfr2': { en: 'Eliminating Front Rise Wrinkles', fr: 'Éliminer les plis au montant avant' },
  'adj.pfr2.problem': { en: 'Diagonal wrinkles radiate from the front crotch point, pointing upward toward the hip or downward toward the inner thigh.', fr: 'Des plis diagonaux partent du point d\'entrejambe avant, pointant vers le haut (hanche) ou vers le bas (cuisse intérieure).' },
  'adj.pfr2.solution': { en: 'Wrinkles pointing upward: the front rise is too long — take in the front rise seam or reduce the crotch depth. Wrinkles pointing downward: the crotch depth is too short or the rise curve is too straight — lengthen the front rise or deepen the curve.', fr: 'Plis pointant vers le haut : le montant avant est trop long — rentrez la couture du montant avant ou réduisez la profondeur d\'entrejambe. Plis pointant vers le bas : la profondeur est trop courte ou la courbe trop droite — rallongez le montant ou approfondissez la courbe.' },
  'adj.pfr2.tip': { en: 'Pin out the wrinkle on the muslin and measure the correction before transferring it to the pattern.', fr: 'Pincez le pli sur la toile et mesurez la correction avant de la reporter sur le patron.' },

  'adj.pfr3': { en: 'Excess at the Front Rise Curve', fr: 'Excès de tissu à la courbe du montant avant' },
  'adj.pfr3.problem': { en: 'Extra fabric forms a pouch or bubble at the front crotch area, creating loose, unflattering fullness below the waist.', fr: 'Un excès de tissu forme une poche ou une bulle à l\'entrejambe avant, créant une ampleur lâche et disgracieuse sous la ceinture.' },
  'adj.pfr3.solution': { en: 'Reduce the front crotch extension (the horizontal distance from the inseam to the crotch curve) by 0.5–1 cm, tapering back to the original line at the inseam. A flatter front body profile needs less crotch extension than patterns drafted for average figures.', fr: 'Réduisez l\'extension d\'entrejambe avant (la distance horizontale entre la couture intérieure et la courbe d\'entrejambe) de 0,5 à 1 cm, en dégradant jusqu\'à la ligne d\'origine à la couture intérieure. Un profil avant plus plat nécessite moins d\'extension que les patrons tracés pour une morphologie moyenne.' },
  'adj.pfr3.tip': { en: 'Excess front rise curve is common in patterns graded for larger sizes but not adjusted for a flatter front body profile.', fr: 'L\'excès de courbe du montant avant est courant dans les patrons gradés pour les grandes tailles mais non ajustés pour un profil avant plus plat.' },

  'adj.pfr4': { en: 'Camel Toe at the Front Rise Curve', fr: 'Compression à la courbe du montant avant' },
  'adj.pfr4.problem': { en: 'The front crotch seam creates a visible pulled line between the legs when worn.', fr: 'La couture de l\'entrejambe avant crée une ligne de compression visible entre les jambes lorsque le pantalon est porté.' },
  'adj.pfr4.solution': { en: 'Reduce the depth of the front crotch curve by 0.5–1 cm. The front crotch curve should be shallow and gradual — a curve that is too deep pulls into the body. Also verify that there is sufficient ease across the crotch.', fr: 'Réduisez la profondeur de la courbe d\'entrejambe avant de 0,5 à 1 cm. La courbe devant doit être peu profonde et progressive — une courbe trop profonde s\'enfonce dans le corps. Vérifiez aussi qu\'il y a suffisamment d\'aisance à l\'entrejambe.' },
  'adj.pfr4.tip': { en: 'Make adjustments in 0.5 cm increments and test each change on a muslin — this correction is very sensitive.', fr: 'Effectuez les corrections par tranches de 0,5 cm et testez chaque changement sur une toile — cette correction est très sensible.' },

  // Back Draglines corrections
  'adj.pbd1': { en: 'Acceptable Back Draglines/Creases', fr: 'Faux plis acceptables au dos' },
  'adj.pbd1.problem': { en: 'Faint diagonal lines appear below the seat on the back of the pants but cause no discomfort.', fr: 'De légers plis diagonaux apparaissent sous les fesses au dos du pantalon mais ne causent aucune gêne.' },
  'adj.pbd1.solution': { en: 'Minor back draglines can be acceptable depending on fabric, style, and body shape. A slight crease running from the inseam area toward the seat is common in ready-to-wear. Evaluate whether the lines are prominent enough to warrant re-cutting.', fr: 'De légers faux plis dos peuvent être acceptables selon le tissu, le style et la morphologie. Une légère ligne partant de la couture intérieure vers les fesses est courante dans le prêt-à-porter. Évaluez si les lignes sont suffisamment visibles pour justifier une correction.' },
  'adj.pbd1.tip': { en: 'Draped or soft fabrics show draglines more than structured ones — consider fabric choice before deciding to re-cut.', fr: 'Les tissus drapés ou souples accentuent les faux plis plus que les tissus structurés — tenez compte du tissu avant de décider de recouper.' },

  'adj.pbd2': { en: 'Those Dreaded Back Draglines on Pants', fr: 'Ces redoutables faux plis au dos du pantalon' },
  'adj.pbd2.problem': { en: 'Prominent diagonal drag lines run from the back inseam upward toward the seat, creating an unflattering appearance and sometimes causing discomfort.', fr: 'Des faux plis diagonaux marqués partent de la couture intérieure dos vers les fesses, créant un aspect disgracieux et parfois une gêne.' },
  'adj.pbd2.solution': { en: 'The back crotch curve is too straight or the back crotch extension is too short. Increase the back crotch extension by 1–2 cm and deepen the back crotch curve slightly. Also check whether the back rise is long enough for the seat depth.', fr: 'La courbe d\'entrejambe dos est trop droite ou l\'extension d\'entrejambe dos est trop courte. Augmentez l\'extension d\'entrejambe dos de 1 à 2 cm et approfondissez légèrement la courbe. Vérifiez aussi si le montant dos est assez long pour la profondeur des fesses.' },
  'adj.pbd2.tip': { en: 'Back draglines are one of the most common pants fitting problems — take the time to fit the back crotch carefully on a muslin.', fr: 'Les faux plis dos sont l\'un des problèmes d\'ajustement les plus courants — prenez le temps d\'ajuster soigneusement l\'entrejambe dos sur une toile.' },

  'adj.pbd3': { en: 'Excessive and Deep Back Crease Lines', fr: 'Faux plis excessifs et profonds au dos' },
  'adj.pbd3.problem': { en: 'Deep, sharp crease lines form at the back thigh, indicating significant tightness or a major mismatch between the crotch curve and the body.', fr: 'Des lignes de pliure profondes et nettes se forment à la cuisse dos, indiquant une tension importante ou un décalage majeur entre la courbe d\'entrejambe et le corps.' },
  'adj.pbd3.solution': { en: 'Check both the back crotch extension and the seat curve depth. Increase the crotch extension generously and re-shape the back crotch curve with a deeper, more sweeping arc. Also verify that the thigh circumference has adequate ease (at least 2–3 cm).', fr: 'Vérifiez l\'extension d\'entrejambe dos et la profondeur de la courbe des fesses. Augmentez généreusement l\'extension et retracez la courbe d\'entrejambe dos avec un arc plus profond et plus ample. Vérifiez aussi que le tour de cuisse a suffisamment d\'aisance (au moins 2 à 3 cm).' },
  'adj.pbd3.tip': { en: 'If crease lines are very deep, the required correction may be larger than expected — work in stages on the muslin.', fr: 'Si les lignes de pliure sont très profondes, la correction nécessaire peut être plus importante que prévu — travaillez par étapes sur la toile.' },

  'adj.pbd4': { en: 'Gaping at the Back Waist', fr: 'Bâillement à la ceinture dos' },
  'adj.pbd4.problem': { en: 'The waistband at center back pulls away from the body, leaving a gap and allowing the pants to ride down.', fr: 'La ceinture au milieu dos s\'écarte du corps, laissant un espace et faisant glisser le pantalon vers le bas.' },
  'adj.pbd4.solution': { en: 'For a swayback or flat seat: take in the center back seam between the waist and hip, tapering to nothing at the hip level. The amount of correction equals the size of the gap. Alternatively, add elastic to the center back waistband only.', fr: 'Pour un dos creux ou des fesses plates : rentrez la couture milieu dos entre la ceinture et la hanche, en dégradant jusqu\'à rien au niveau de la hanche. La valeur de correction est égale à la taille du bâillement. Vous pouvez aussi ajouter un élastique uniquement au milieu dos de la ceinture.' },
  'adj.pbd4.tip': { en: 'Measure the gap at center back while wearing the pants to find the exact correction needed.', fr: 'Mesurez le bâillement au milieu dos en portant le pantalon pour trouver la correction exacte nécessaire.' },

  // Pockets & Lower Leg corrections
  'adj.ppl1': { en: 'Making a Pocket Opening Bigger', fr: 'Agrandir l\'ouverture d\'une poche' },
  'adj.ppl1.problem': { en: 'The pocket opening is too small, making it difficult to reach inside comfortably.', fr: 'L\'ouverture de poche est trop petite, rendant difficile l\'accès à l\'intérieur confortablement.' },
  'adj.ppl1.solution': { en: 'Extend the pocket opening length by 1–2 cm at the top and/or bottom edge. Re-draw the facing curve to match. For side seam pockets, simply cut the facing and pocket bag slightly longer at the opening edge.', fr: 'Allongez l\'ouverture de poche de 1 à 2 cm en haut et/ou en bas. Retracez la courbe du passepoil pour correspondre. Pour les poches à la couture de côté, coupez simplement le passepoil et le fond de poche légèrement plus longs au bord de l\'ouverture.' },
  'adj.ppl1.tip': { en: 'Standard pocket openings are 15–17 cm for most adults — adjust for individual hand size.', fr: 'Les ouvertures de poches standard mesurent 15 à 17 cm pour la plupart des adultes — ajustez selon la taille de la main.' },

  'adj.ppl2': { en: 'Gaping Pocket Openings', fr: 'Bâillement des ouvertures de poches' },
  'adj.ppl2.problem': { en: 'The pocket opening gapes open at the hip, revealing the pocket bag and creating an unflattering bulge.', fr: 'L\'ouverture de poche bâille à la hanche, laissant voir le fond de poche et créant une bosse disgracieuse.' },
  'adj.ppl2.solution': { en: 'The opening is too wide or the pants are too tight at the hip, pulling the pocket open. Reduce the pocket opening length by 1 cm, or increase the hip ease to relieve the tension. Topstitching the opening edges slightly closed can help as a quick fix.', fr: 'L\'ouverture est trop large ou le pantalon est trop serré à la hanche, ce qui tire la poche ouverte. Réduisez la longueur d\'ouverture de 1 cm, ou augmentez l\'aisance de hanche pour libérer la tension. Une piqûre sur la lisière de l\'ouverture peut aider comme correction rapide.' },
  'adj.ppl2.tip': { en: 'Gaping pockets often signal insufficient hip ease — address the hip ease before adjusting the pocket itself.', fr: 'Le bâillement des poches signale souvent une aisance insuffisante aux hanches — corrigez l\'aisance de hanche avant d\'ajuster la poche.' },

  'adj.ppl3': { en: 'Calf Adjustment', fr: 'Ajustement du mollet' },
  'adj.ppl3.problem': { en: 'The pants are too tight or too loose at the calf level, causing discomfort or an unflattering silhouette below the knee.', fr: 'Le pantalon est trop serré ou trop ample au niveau du mollet, causant une gêne ou une silhouette disgracieuse sous le genou.' },
  'adj.ppl3.solution': { en: 'For tight calves: add 1–2 cm to each side seam at the calf level, tapering to nothing at knee and ankle. For excess fabric: take in the same amount. Keep adjustments symmetrical on both the front and back panels.', fr: 'Pour des mollets forts : ajoutez 1 à 2 cm à chaque couture de côté au niveau du mollet, en dégradant jusqu\'à rien au genou et à la cheville. Pour un excès de tissu : rentrez la même valeur. Gardez les ajustements symétriques sur les panneaux devant et dos.' },
  'adj.ppl3.tip': { en: 'Calf circumference varies greatly between individuals — always measure before drafting the lower leg.', fr: 'Le tour de mollet varie beaucoup d\'une personne à l\'autre — mesurez toujours avant de tracer le bas de jambe.' },

  'adj.ppl4': { en: 'Eliminating the Winged-Leg Look on Shorts', fr: 'Supprimer l\'effet "ailes" au bas du short' },
  'adj.ppl4.problem': { en: 'The inner thigh hem of the shorts hangs lower than the outer leg, creating a drooping or "winged" look at the hem.', fr: 'L\'ourlet de la cuisse intérieure du short descend plus bas que la jambe extérieure, créant un aspect tombant en "ailes" à l\'ourlet.' },
  'adj.ppl4.solution': { en: 'Raise the inseam hem by 1–2 cm, tapering to nothing before the knee level. This lifts the inner leg without affecting the side seam. Also check that the crotch curve isn\'t too deep, which can cause the inner thigh to hang.', fr: 'Remontez l\'ourlet de la couture intérieure de 1 à 2 cm, en dégradant jusqu\'à rien avant le niveau du genou. Cela relève la jambe intérieure sans affecter la couture de côté. Vérifiez aussi que la courbe d\'entrejambe n\'est pas trop profonde, ce qui peut faire pendre la cuisse intérieure.' },
  'adj.ppl4.tip': { en: 'This issue is more visible in wide-leg or relaxed-fit shorts — adjusting the leg width may also help.', fr: 'Ce problème est plus visible dans les shorts à jambe large ou à coupe ample — ajuster la largeur de jambe peut aussi aider.' },

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
  'pricing.mostPopular': { en: 'Recommended', fr: 'Recommandé' },
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
  'pricing.basic.title': { en: 'Atelier', fr: 'Atelier' },
  'pricing.basic.desc': { en: 'For enthusiasts', fr: 'Pour les passionné.e.s' },
  'pricing.basic.f1': { en: '10 patterns per month', fr: '10 patrons par mois' },
  'pricing.basic.f2': { en: 'All pattern types', fr: 'Tous les types de patrons' },
  'pricing.basic.f3': { en: 'Save measurements', fr: 'Sauvegarde des mesures' },
  'pricing.basic.f4': { en: 'PDF export', fr: 'Export PDF' },
  'pricing.basic.f5': { en: 'Fitting guide included', fr: 'Guide d\'ajustement inclus' },

  // Pro card
  'pricing.pro.title': { en: 'Studio', fr: 'Studio' },
  'pricing.pro.desc': { en: 'To go further', fr: 'Pour aller plus loin' },
  'pricing.pro.f1': { en: 'Unlimited patterns', fr: 'Patrons illimités' },
  'pricing.pro.f2': { en: 'All pattern types', fr: 'Tous les types de patrons' },
  'pricing.pro.f3': { en: 'Save measurements', fr: 'Sauvegarde des mesures' },
  'pricing.pro.f4': { en: 'PDF export', fr: 'Export PDF' },
  'pricing.pro.f5': { en: 'Fitting guide included', fr: 'Guide d\'ajustement inclus' },
  'pricing.pro.f6': { en: 'Early access to new features', fr: 'Accès anticipé aux nouveautés' },
  'pricing.pro.f7': { en: 'Priority support', fr: 'Support prioritaire' },

  // FAQ
  'pricing.faq.title': { en: 'Frequently Asked Questions', fr: 'Questions fréquentes' },
  'pricing.faq.q1': { en: 'What patterns are included?', fr: 'Quels patrons sont inclus ?' },
  'pricing.faq.a1': { en: 'Currently we offer skirt slopers, with bodice, dress, pants, and sleeve patterns coming soon. All subscribers get access to new patterns as they\'re released.', fr: 'Nous proposons actuellement des bases de jupes, avec les corsages, robes, pantalons et manches à venir. Tous les abonnés ont accès aux nouveaux patrons dès leur sortie.' },
  'pricing.faq.q2': { en: 'Can I cancel anytime?', fr: 'Puis-je annuler à tout moment ?' },
  'pricing.faq.a2': { en: 'Yes! You can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.', fr: 'Oui ! Vous pouvez annuler votre abonnement à tout moment. Vous conservez l\'accès jusqu\'à la fin de votre période de facturation.' },
  'pricing.faq.q3': { en: 'Do single purchases expire?', fr: 'Les achats à l\'unité expirent-ils ?' },
  'pricing.faq.a3': { en: 'No, single pattern purchases give you lifetime access to that pattern type.', fr: 'Non, l\'achat d\'un patron vous donne un accès à vie à ce type de patron.' },
  'pricing.faq.q4': { en: 'What paper should I print on?', fr: 'Sur quel papier imprimer ?' },
  'pricing.faq.a4': { en: 'Print on standard A4 paper at 100% scale (no scaling). Each PDF includes a 1cm test square to verify before assembling the pages.', fr: 'Imprimez sur du papier A4 standard, à 100% (sans mise à l\'échelle). Chaque PDF contient un carré test de 1 cm à vérifier avant d\'assembler les pages.' },
  'pricing.faq.q5': { en: 'Do I need pattern-making knowledge?', fr: 'Faut-il des connaissances en modélisme ?' },
  'pricing.faq.a5': { en: 'No. You enter your measurements, the studio generates the pattern. The built-in fitting guide helps you correct minor differences if needed.', fr: 'Non. Vous entrez vos mesures, le studio génère le patron. Le guide d\'ajustement intégré vous aide à corriger les petits écarts si besoin.' },
  'pricing.faq.q6': { en: 'Do patterns include seam allowances?', fr: 'Les patrons incluent-ils les marges de couture ?' },
  'pricing.faq.a6': { en: 'No — patterns are basic blocks without seam allowances. Add 1 to 1.5 cm on all edges before cutting your fabric.', fr: 'Non — les patrons sont des blocs de base sans marges de couture. Ajoutez 1 à 1,5 cm sur tous les bords avant de couper votre tissu.' },
  'pricing.faq.q7': { en: 'Are my measurements saved?', fr: 'Mes mesures sont-elles sauvegardées ?' },
  'pricing.faq.a7': { en: 'Yes, your measurements are saved in your profile. You don\'t need to re-enter them each time.', fr: 'Oui, vos mensurations sont enregistrées dans votre profil. Vous n\'avez pas à les ressaisir à chaque génération.' },
  'pricing.faq.q8': { en: 'Can I use the patterns commercially?', fr: 'Puis-je utiliser les patrons commercialement ?' },
  'pricing.faq.a8': { en: 'No — generated patterns are for personal use only.', fr: 'Non — les patrons générés sont pour un usage personnel uniquement.' },

  // Pattern Locked
  'locked.title': { en: 'Pattern Locked', fr: 'Patron verrouillé' },
  'locked.description': { en: 'Subscribe to access this pattern, or purchase it individually for', fr: 'Abonnez-vous pour accéder à ce patron, ou achetez-le individuellement pour' },
  'locked.buyFor': { en: 'Buy for', fr: 'Acheter pour' },

  // Toasts
  'toast.signInToPurchase': { en: 'Please sign in to purchase patterns', fr: 'Veuillez vous connecter pour acheter des patrons' },
  'toast.checkoutFailed': { en: 'Failed to start checkout', fr: 'Échec du lancement du paiement' },
  'toast.pdfDownloaded': { en: 'PDF downloaded!', fr: 'PDF téléchargé !' },
  'toast.pdfError': { en: 'Failed to generate PDF', fr: 'Échec de la génération du PDF' },

  // Auth page
  'auth.createAccount': { en: 'Create your account', fr: 'Créer votre compte' },
  'auth.createAccountDesc': { en: 'Start creating custom sewing patterns', fr: 'Commencez à créer vos patrons sur mesure' },
  'auth.welcomeBack': { en: 'Welcome back', fr: 'Bon retour' },
  'auth.welcomeBackDesc': { en: 'Sign in to access your saved patterns', fr: 'Connectez-vous pour accéder à vos patrons' },
  'auth.resetPassword': { en: 'Reset your password', fr: 'Réinitialiser votre mot de passe' },
  'auth.resetPasswordDesc': { en: "Enter your email and we'll send you a reset link", fr: 'Entrez votre email pour recevoir un lien de réinitialisation' },
  'auth.setNewPassword': { en: 'Set new password', fr: 'Définir un nouveau mot de passe' },
  'auth.setNewPasswordDesc': { en: 'Enter your new password below', fr: 'Entrez votre nouveau mot de passe ci-dessous' },
  'auth.email': { en: 'Email', fr: 'Email' },
  'auth.password': { en: 'Password', fr: 'Mot de passe' },
  'auth.newPassword': { en: 'New Password', fr: 'Nouveau mot de passe' },
  'auth.confirmPassword': { en: 'Confirm Password', fr: 'Confirmer le mot de passe' },
  'auth.forgotPassword': { en: 'Forgot password?', fr: 'Mot de passe oublié ?' },
  'auth.signingIn': { en: 'Signing in...', fr: 'Connexion en cours...' },
  'auth.creatingAccount': { en: 'Creating account...', fr: 'Création du compte...' },
  'auth.sendingEmail': { en: 'Sending email...', fr: 'Envoi en cours...' },
  'auth.updatingPassword': { en: 'Updating password...', fr: 'Mise à jour...' },
  'auth.createAccountBtn': { en: 'Create Account', fr: 'Créer un compte' },
  'auth.sendResetLink': { en: 'Send Reset Link', fr: 'Envoyer le lien' },
  'auth.updatePassword': { en: 'Update Password', fr: 'Mettre à jour' },
  'auth.backToSignIn': { en: 'Back to sign in', fr: 'Retour à la connexion' },
  'auth.noAccount': { en: "Don't have an account? Sign up", fr: 'Pas de compte ? Inscrivez-vous' },
  'auth.hasAccount': { en: 'Already have an account? Sign in', fr: 'Déjà un compte ? Connectez-vous' },
  'auth.invalidEmail': { en: 'Please enter a valid email address', fr: 'Veuillez entrer une adresse email valide' },
  'auth.passwordMin': { en: 'Password must be at least 6 characters', fr: 'Le mot de passe doit contenir au moins 6 caractères' },
  'auth.passwordsNoMatch': { en: 'Passwords do not match', fr: 'Les mots de passe ne correspondent pas' },
  'auth.invalidCredentials': { en: 'Invalid email or password', fr: 'Email ou mot de passe incorrect' },
  'auth.emailRegistered': { en: 'This email is already registered. Please sign in instead.', fr: 'Cet email est déjà enregistré. Veuillez vous connecter.' },
  'auth.welcomeBackToast': { en: 'Welcome back!', fr: 'Bon retour !' },
  'auth.accountCreated': { en: 'Account created successfully!', fr: 'Compte créé avec succès !' },
  'auth.resetEmailSent': { en: 'Password reset email sent! Check your inbox.', fr: 'Email de réinitialisation envoyé ! Vérifiez votre boîte mail.' },
  'auth.passwordUpdated': { en: 'Password updated successfully!', fr: 'Mot de passe mis à jour avec succès !' },
  'auth.unexpectedError': { en: 'An unexpected error occurred', fr: 'Une erreur inattendue s\'est produite' },
  'auth.confirmEmailTitle': { en: 'Check your inbox', fr: 'Vérifiez votre boîte mail' },
  'auth.confirmEmailDesc': { en: 'We sent a confirmation link to {email}. Click it to activate your account, then sign in.', fr: 'Nous avons envoyé un lien de confirmation à {email}. Cliquez dessus pour activer votre compte, puis connectez-vous.' },
  'auth.goToSignIn': { en: 'Go to sign in', fr: 'Aller à la connexion' },
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
