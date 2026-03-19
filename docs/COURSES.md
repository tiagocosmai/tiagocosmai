# Cursos

## Fonte em português

1. Edite **`src/data/courses.txt`** (formato legado, fácil de colar linhas):

   - **À distância:** blocos `===Nome do provedor===` ou `===Nome|https://url===`, uma linha por curso.
   - **`===PRESENCIAL===`** seguido dos itens presenciais (um por linha).
   - **`===EVENTOS===`** seguido de eventos/palestras (um por linha).

2. Gere o JSON usado pelo site e pelo CV:

   ```bash
   npm run sync:courses
   ```

   Isso atualiza **`src/data/courses.json`** (campo `pt` em cada item).

## Inglês e espanhol

Traduções são aplicadas em **`src/lib/courseI18n.ts`** (regras + mapas por frase). Textos já em inglês no `.txt` passam só pela normalização de “Horas” → “hours” / “horas”. Para títulos muito específicos, amplie os mapas `exact` ou as listas de `pairs` em `toEn` / `toEs`.
