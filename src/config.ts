
import { IResource } from './interfaces'

// Rôles modifiables par l'utilisateur
export const roles = {
  fullstack: '305381229753139200',
  backend:   '305381310996676609',
  frontend:  '305381272832704514',
  devops:    '305426040077942785',
  designer:  '305425719515938836',
  freelance: '305381504479920129',
  etudiant:  '305381380802609163'
}
export const syntax = {
  '245543980224217089': /^(\[[^\]]+\]|<\:[a-z0-9]+\:[0-9]+>) .+ https?:\/\/\S*$/i,
  '106702700409815040': /^(\[[^\]]+\]|<\:[a-z0-9]+\:[0-9]+>) .+ https?:\/\/\S*$/i
}
export const loggerId = '477123703658905606'
export const guildId = '85154866468487168' // Id du serveur Grafikart.fr
// ressources
export const resources: IResource[] = [
  { name: 'Cours complet sur l\'HTML et le CSS:', website: 'https://marksheet.io/' },
  { name: 'Une des meilleures documentation pour les technologies web:', website: 'https://developer.mozilla.org/en-US/' },
  { name: 'Cours complets sur le Javascript:', website: 'http://eloquentjavascript.net/\nhttp://javascript.info/' },
  { name: 'Documentation PHP:', website: 'https://secure.php.net' },
  { name: 'Un site regroupant une tonne de documentations sur différents langages/technologies:', website: 'https://devdocs.io/' },
  { name: 'Un site regroupant des trucs et astuces (Tips) sur de nombreuses technologies:', website: 'https://devhints.io/' }
]
