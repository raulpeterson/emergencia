# Emergência Família V4

Mantém as mesmas URLs da V3.

## Onde editar

- Raul: `e/RH2GA9UZ/data.js`
- Jessica: `e/CJA8B9E6/data.js`
- Joaquim: `e/HLAXNLJG/data.js`
- Elisa: `e/WBCQJDYK/data.js`

Você altera somente o `data.js` de cada pessoa.

Campos vazios de alergias, medicamentos, condições, convênio e orientações ficam ocultos automaticamente.

Exemplo de contatos:

```js
contatos: [
  {
    nome: "Jessica Borges Schwarz",
    parentesco: "Mãe",
    telefone: "+5545999849640",
    whatsapp: true
  },
  {
    nome: "Raul Peterson Horn Schwarz",
    parentesco: "Pai",
    telefone: "+5545999265020",
    whatsapp: true
  }
]
```

Para foto, coloque o arquivo em `assets/`, por exemplo `assets/raul.jpg`, e no data.js use:

```js
foto: "../../assets/raul.jpg"
```


## V4.2

- botão Ligar dos contatos agora usa visual claro/vermelho, em vez de preto
- ícone de WhatsApp superior corrigido para SVG completo
- ícones de telefone do SAMU e Bombeiros corrigidos
- tipo sanguíneo agora aparece como "TIPO SANGUÍNEO" + descrição (ex.: A+ / A positivo)
- URLs e dados permanecem inalterados
