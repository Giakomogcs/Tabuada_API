# MAPS (Mapeamento Automático de Patrimônios SENAI)

A aplicação que irá servir de base para o video de homologação da técnologia BLE para o rastreamento dos patrimônios.

Tecnologias usadas: `JavaScript`, `Node.js`, `CockroachDB`

## Deploy

O link do deploy é:

```bash
  URL
```

## Start

Instale o projeto com npm

```bash
  npm install
  npm start
```

## 🔗 Links

[![Figma](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIEAAACBCAMAAADQfiliAAAA8FBMVEX/////cmKiWf/yTh4Kz4MavP75YUXxTBicTP//Y1DxNwD/cF8A0IEAzHv719H/3drpUFKjWfkzwpfTt/8AuP6m6Mb/iHz/+vqfUv//aVinUf8AwP7/8O//lozxPwD17/+7jP92z/7q9//Xvf+U2f4AtP6v4f7Io/+ZRf/w6P/A5/+1gv9gyv7o2v+t5f7R7v/Dm/+6rf93k//N8d/6vbX1gGn4Tir/x8PyUi/2koH/pZ30blb6zcf95+P/fG73qZ38po/zbWnygHyuev+oZv6bof/Srf/K9tuV6bVk1KKt4dA/0o3v+vR/36/g9uu369Amyuh0AAACpklEQVR4nO2Xa3fSQBCGk5RASNhgbSiNBSoUL1Uqaoq2CkXxisH6//+NISLmMss5nLMzyTnO85UP82T23Z1B0xiGYRiGYRiGYRiFdJpugmaKDn75q4md5k09Tfctav3pda92kKJW1dM4vj7FE7jJ1gcM1g7vsAQmvWx90EDX/S6OwI2dF4AN9DpKF1xIQGKg15vqBdrvcxnYYeAct5UbTIEQyA0wmgDFcIcBQhivwUOQGui6aoEZWH+HgTNTbODCLdhhoDoILhwDQoNm4T3oHOybROWDurqfgXOrWkCb7/kezJUbSK6jtAeqL6O2Xg72MEBZETo1KAmyyaR+MEXMbEBBsh8gnMGaKdAFyMBx0DZFt5pbFAED/xZhPdkyt+1eLUU1+uQEft2/Qqy/xv0wuZfk4/GWxWLRnbvI9bWLr58+HyY4OdLaMePhqRkxGo5R6589tCwjhXUU/zAeeZ4Z43n9AZ7AuXViGJDB8JGZwHuMJfDkabb+xmDkmSm8IY7AOSAQG/QzAlhduMidwMbgWU4gUsDIwnOZASAQ3Qn1ApcWJBAZvAANPPWX8qXMYAQJmGZfucEhKGBYr05hA1O1wBksYDz4IjNQncVLMIeRwWuZgeogsEEZclD8XSjBe1D8m1j8XCjBbCx+PyjBjlSCPbEEu7IG/l/4w7hP8n8h4tv35f0kP/79NBjgfn1MS4hGCtHCL5ogCEUlA61B0GhkBWgNglwDiA1WQH1ag59QCygN7sAWUBq0wBZQGsAtIDSAc0hpEOSfAjYgN5BcxooIqAykd+GOzGAJH0O4IjMA5xLtaAyhJgi6FsBNIN6Q8sNRhKQCURhFVoDyDGLSXRBLcoFoVa+ITR4bgjgDW34tRUzYKqABf1kFAd1DyDAMwzAMwzAM83/zGw/oWD0HUJHMAAAAAElFTkSuQmCC)](https://www.figma.com/file/Qn9Ag4mq6rNwYlcmHcq5Bb/MAPS?type=design&node-id=0-1&mode=design&t=y8ByUeegDYiOss7v-0)

## Documentação da API

#### Cria tag

```http
  POST http://localhost:3333/api/tags
```

```json
{
    "id": string,
    "patrimony": string,
    "tag_id": string,
    "description": string,
    "responsible": string,
    "last_read": timestamp,
    "is_active": boolean
}
```

#### Pesquisar tags

```http
  GET http://localhost:3333/api/tags
```

```json
[
  {
    "id": 1,
    "patrimony": "35235",
    "description": "Monitor",
    "responsible": "Giovani",
    "tag_id": "676756785636363",
    "last_read": "2023-11-23T17:59:36.247Z",
    "is_active": true
  },
  {
    "id": 2,
    "patrimony": "35235",
    "description": "Monitor",
    "responsible": "Giovani",
    "tag_id": "676756785636363",
    "last_read": "2023-11-23T17:17:51.124Z",
    "is_active": true
  },
  {
    "id": 4,
    "patrimony": "35235",
    "description": "Monitor",
    "responsible": "Giovani",
    "tag_id": "676756785636363",
    "last_read": "2023-11-23T17:17:54.275Z",
    "is_active": true
  }
]
```

#### Alterar informações do patrimônio se está sendo localizado ou não

```http
  PATCH http://localhost:3333/api/tags/${id}
```

| Parâmetro | Tipo     | Descrição                                   |
| :-------- | :------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O ID do item que você quer |

```json
return:
{
	"id": 5,
	"patrimony": "35233",
	"description": "Monitor",
	"responsible": "Giovani",
	"tag_id": "676756785636364",
	"last_read": "2023-11-23T18:01:32.318Z",
	"is_active": false
}
```

#### Deletar tag

```http
  DELETE http://localhost:3333/api/${id}
```

| Parâmetro  | Tipo     | Descrição                                    |
| :--------- | :------- | :------------------------------------------- |
| `prato_id` | `string` | **Obrigatório**. O ID do prato que você quer |

## Feedback

Se você tiver algum feedback, por favor nos deixe saber por meio de giovani.silva@sp.senai.br
