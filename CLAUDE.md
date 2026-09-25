# Studio Petit Citron — instructions permanentes pour Claude Code

## Tests avant tout commit — non négociable

Avant tout commit sur ce repo, exécuter :

```
npm run test
```

**Ne jamais commit si cette commande échoue.** Elle est aussi câblée en hook
pre-commit (`.husky/pre-commit`) et en CI (`.github/workflows/test.yml`) — un échec
local doit être corrigé avant de committer, pas contourné avec `git commit
--no-verify`.

La suite couvre (voir `src/test/`) :
- `pattern-generation.test.tsx` — génération jupe/corsage/pantalon × femme/homme/
  enfant avec mesures par défaut, sans erreur console.
- `pdf-export-generation.test.ts` — export PDF de chaque combinaison ci-dessus dans
  chaque format (A4, US Letter, A0, projection).
- `index-navigation-regression.test.tsx` — régression bug #7 (mise à jour du profil
  puis retour vers "mes patrons" ne doit jamais laisser une page blanche).
- `index-tab-switch-regression.test.tsx` — régression bug #9 (changement d'onglet
  entre toutes les combinaisons femme/homme/enfant × jupe/corsage/pantalon sans
  planter l'interface).
- `PatternErrorBoundary.test.tsx` — le filet de sécurité `PatternErrorBoundary`
  (src/components/PatternErrorBoundary.tsx) : une erreur de rendu sur un onglet ne
  doit jamais faire planter les autres.

Ces tests tournent sous Vitest + Testing Library (déjà installés dans ce repo), en
jsdom, jamais contre la vraie base Supabase de production ni un vrai compte
testeuse — voir `src/test/testSupabaseMock.ts` pour le mock utilisé par les tests
qui montent `Index.tsx` en entier.

## Quand corriger un bug bloquant

**Si tu corriges un nouveau bug bloquant (plantage, page blanche, échec d'export
PDF), ajoute un test de non-régression correspondant dans `src/test/` avant de
considérer le fix terminé.** Un fix sans test de non-régression n'est pas fini —
c'est ainsi que les bugs #7 et #9 sont réapparus une deuxième fois avant d'être
attrapés automatiquement.

## Pourquoi Vitest + Testing Library plutôt que Playwright

Vitest + @testing-library/react étaient déjà installés et utilisés (voir
`src/test/pdf-tile-grid.test.ts`, antérieur à cette suite) avant que Playwright ne
soit envisagé. Les deux bugs critiques (#7, #9) sont des crashs de rendu React
détectables au niveau composant/page (montage avec Testing Library + jsdom), pas des
problèmes qui nécessitent un vrai navigateur (pas de canvas, pas de layout réel
requis). jsPDF (génération des PDF) est une bibliothèque de dessin vectoriel pur qui
tourne aussi bien sous jsdom que dans un navigateur. Ajouter Playwright aurait
introduit une dépendance lourde (binaires de navigateur, temps CI bien plus long)
pour une classe de bugs déjà couverte sans lui. À reconsidérer seulement si un futur
bug s'avère spécifique au rendu navigateur réel (mise en page CSS, impression PDF
physique, etc.).
