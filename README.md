# Desafio
## Primeiro desafio.

Objetivo: Ordenar usuarios por idade, do mais novo ao mais velho. Como segundo criterio de ordenacao deve ser ordem alfabetica.
Exemplo:
```json
[
  {
    "name": "Vicente",
    "age": 24
  },
  {
    "name": "Vicente",
    "age": 26
  },
  {
    "name": "Xuxa",
    "age": 94
  },
]
```

## Segundo desafio.

Objetivo: Criar uma api com os seguintes endpoints;

- /candidates
  - Este endpoint deve criar um novo usuario.
  
- /candidates/search
  - Este endpoint deve validar se ha uma busca por tags
  - A ordem do retorno deve corresponder a ordem de relevancia. O usuario que possuir o maior numero de tags que correspondem a busca deve vir primeiro na listagem
  
**OBSERVACOES**
  - Deve ser feito em Javascript (Sem Typescript), com express e em somente 1 arquivo.
  - Trate bem o codigo, afinal. Outras pessoas devem entende-lo
  