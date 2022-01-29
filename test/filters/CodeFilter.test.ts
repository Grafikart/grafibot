import { fakeMessage } from "../helpers";
import { CodeFilter } from "../../src/filters";

const filter = new CodeFilter();
const match = [
  `
  if(isset($_SESSION['id']) AND !empty($_SESSION['id']))
    {
        $id_planete_utilise=$_SESSION['planete_utilise'];
        $req_affichage_defense=$bdd->prepare('SELECT * FROM defense WHERE id_planete = ?');
        $req_affichage_defense->execute(array($id_planete_utilise));
        while($affichage_defense=$req_affichage_defense->fetch());
        $req_affichage_defense=$bdd->prepare('SELECT * FROM defense WHERE id_planete = ?');
        $req_affichage_defense->execute(array($id_planete_utilise));
        while($affichage_defense=$req_affichage_defense->fetch());
    }
  `.repeat(5),
  `#!/bin/bash
   
    $server=$1
    $map=$2
    if [ map == 'tower' ]; then
      cd /servers/server;
   
    $server=$1
    $map=$2
   
    $server=$1
    $map=$2
    if [ map == 'tower' ]; then
      cd /servers/server;
   
    $server=$1
    $map=$2`.repeat(3),
];
const noMatch = [
  `if(isset($_SESSION['id']) AND !empty($_SESSION['id'])){
    $id_planete_utilise=$_SESSION['planete_utilise'];
  }`,
];

describe("CodeFilter", () => {
  it("détecte le code copié / collé", () => {
    match.forEach(function (m) {
      let message = fakeMessage(m);
      expect(filter.filter(message)).toBe(true);
      expect(message.author.createDM).toHaveBeenCalled();
    });
  });

  it("laisse passer les messages", () => {
    noMatch.forEach(function (m) {
      let message = fakeMessage(m);
      expect(filter.filter(message)).toBe(false);
      expect(message.author.createDM).not.toHaveBeenCalled();
    });
  });
});
