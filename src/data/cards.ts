export interface Card {
  name: string
  type: string
  attack: number
  defense: number
  cost: number
  effect: string
  rarity: string
}

export interface CardData {
  creatures: Card[]
  spells: Card[]
  equipment: Card[]
}

export const cardData: CardData = {
  creatures: [
    { name: "Guerrier Sombre", type: "Créature", attack: 8, defense: 7, cost: 5, effect: "Coup critique (50% de chances de doubler les dégâts)", rarity: "Rare" },
    { name: "Golem de Pierre", type: "Créature", attack: 5, defense: 12, cost: 6, effect: "Réduction de dégâts (Réduit de moitié les dégâts physiques reçus)", rarity: "Commune" },
    { name: "Dragon du Chaos", type: "Créature", attack: 12, defense: 8, cost: 7, effect: "Souffle infernal (Inflige 4 dégâts à tous les ennemis lorsqu'il attaque)", rarity: "Légendaire" },
    { name: "Gobelin Malicieux", type: "Créature", attack: 4, defense: 3, cost: 2, effect: "Vole 1 point d'énergie", rarity: "Commune" },
    { name: "Ange Gardien", type: "Créature", attack: 6, defense: 10, cost: 5, effect: "Soigne 3 points par tour", rarity: "Rare" },
  ],
  spells: [
    { name: "Boule de Feu", type: "Sort", attack: 5, defense: 0, cost: 3, effect: "Inflige 5 dégâts", rarity: "Commune" },
    { name: "Éclair Foudroyant", type: "Sort", attack: 7, defense: 0, cost: 4, effect: "Inflige 7 dégâts", rarity: "Rare" },
    { name: "Protection Sacrée", type: "Sort", attack: 0, defense: 6, cost: 3, effect: "Protège un allié", rarity: "Commune" },
  ],
  equipment: [
    { name: "Épée Runique", type: "Arme", attack: 6, defense: 0, cost: 4, effect: "Double les coups critiques", rarity: "Rare" },
    { name: "Bouclier Sacré", type: "Artefact", attack: 0, defense: 8, cost: 5, effect: "Bloque 1 attaque puissante", rarity: "Rare" },
    { name: "Arc Elfique", type: "Arme", attack: 4, defense: 0, cost: 3, effect: "Tire 2 flèches en 1 tour", rarity: "Commune" },
  ]
}