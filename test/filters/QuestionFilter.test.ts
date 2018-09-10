import { QuestionFilter } from '../../src/filters'
import { expect, chai, fakeMessage } from '../helpers'

const filter = new QuestionFilter()
const questions = [
  "Quelqu'un de calé en JS ?",
  "Quelqu'un utilise ou à déjà utilisé Bramus ici ?",
  'Des personnes qui utilisent Kubernetes ?',
  'Des personnes assez costaud en contrainte de SGBD Ici ?',
  'Des personnes adeptes de rails ?',
  'Des personnes dév sous rails ici ? ',
  'des gens fort en es 2015 ?',
  "quelqu'un à déjà eu à réaliser une map de rpg?",
  "Bonjour qui s'y connaît bien en Rails please ? ",
  "Bonjour qui s'y connais avec prestashop ?",
  "Y'aurais t'il quelqu'un qui utilise MarionetteJs ?",
  "qui pourait m\"aider 2s svp"
]
const notQuestions = [
  'eu, dis toujours',
  "Quelqu'un qui est callé en php pourrait me dire comment détecter la session utilisateur en PHP ?",
  'si je fais ça ça veut dire que je ne publie aucune autre vidéo pendant 2/3 semaines',
  "Pourquoi s'emebeter avec plein de methodes pour les getters et setters ?"
]

describe('QuestionFilter', () => {
  it('détecte les questions', () => {
    questions.forEach(function (q) {
      let message = fakeMessage(q)
      expect(filter.filter(message), q).to.be.true
      expect(message.channel.send).to.be.called()
    })
  })

  it('laisse passer les messages', () => {
    notQuestions.forEach(function (q) {
      let message = fakeMessage(q)
      expect(filter.filter(message), q).to.be.false
      expect(message.channel.send).to.not.be.called()
    })
  })

})
