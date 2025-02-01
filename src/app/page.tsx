import React, { useState } from 'react'
import { Search, Plus, Edit2, X } from 'lucide-react'

interface Card {
  id: string  // Ajout d'un ID unique pour chaque carte
  name: string
  type: string
  attack: number
  defense: number
  cost: number
  effect: string
  rarity: string
}

interface BalanceResult {
  isBalanced: boolean
  score: number
  details: string[]
  suggestions: string[]  // Ajout des suggestions d'amélioration
}

// Constantes pour la validation
const availableTypes = ["Créature", "Sort", "Arme", "Artefact"]
const availableRarities = ["Commune", "Rare", "Épique", "Légendaire"]
const maxStats = {
  'Commune': 15,
  'Rare': 20,
  'Épique': 25,
  'Légendaire': 30
}

// Suggestions d'amélioration par type
const balanceSuggestions = {
  tooWeak: [
    "Augmenter les statistiques en fonction de la rareté",
    "Ajouter un effet supplémentaire",
    "Réduire le coût d'énergie"
  ],
  tooStrong: [
    "Réduire les statistiques",
    "Augmenter le coût d'énergie",
    "Ajouter une condition à l'effet"
  ],
  complexEffect: [
    "Simplifier la description de l'effet",
    "Diviser l'effet en deux cartes distinctes",
    "Augmenter le coût pour justifier la complexité"
  ]
}

// Fonction pour calculer le score de puissance avec plus de précision
const calculatePowerScore = (card: Card): number => {
  let score = 0;
  
  // Score basé sur les stats avec des multiplicateurs selon le type
  if (card.type === 'Créature') {
    score += card.attack * 2.5
    score += card.defense * 2
  } else if (card.type === 'Sort') {
    score += card.attack * 3
    score += card.defense * 2.5
  } else {
    score += card.attack * 2
    score += card.defense * 1.5
  }

  // Bonus/Malus selon la rareté avec ajustement
  const rarityMultiplier = {
    'commune': 1,
    'rare': 1.3,
    'épique': 1.6,
    'légendaire': 2
  }[card.rarity.toLowerCase()] || 1

  // Évaluation plus précise de la complexité des effets
  const effectWords = card.effect.split(' ').length
  const effectComplexity = Math.min(effectWords / 4, 5) // Plafond de complexité
  score += effectComplexity * 1.5

  // Ajout d'un bonus pour les effets spéciaux
  if (card.effect.toLowerCase().includes('double')) score += 3
  if (card.effect.toLowerCase().includes('tous les')) score += 4
  if (card.effect.toLowerCase().includes('permanent')) score += 5

  score *= rarityMultiplier
  return Math.round(score * 10) / 10
}

// Fonction d'évaluation améliorée
const evaluateCardBalance = (card: Card): BalanceResult => {
  const powerScore = calculatePowerScore(card)
  const details: string[] = []
  const suggestions: string[] = []
  let isBalanced = true

  // Vérification du ratio coût/puissance avec plus de nuances
  const costRatio = powerScore / card.cost
  if (costRatio > 3.5) {
    details.push("⚠️ Beaucoup trop puissant pour son coût")
    suggestions.push(...balanceSuggestions.tooStrong)
    isBalanced = false
  } else if (costRatio > 2.5) {
    details.push("⚠️ Légèrement trop puissant")
    suggestions.push("Augmenter légèrement le coût")
    isBalanced = false
  } else if (costRatio < 1) {
    details.push("⚠️ Trop faible pour son coût")
    suggestions.push(...balanceSuggestions.tooWeak)
    isBalanced = false
  }

  // Vérification de la complexité des effets
  const effectWords = card.effect.split(' ').length
  if (effectWords > 15) {
    details.push("⚠️ Effet trop complexe")
    suggestions.push(...balanceSuggestions.complexEffect)
    isBalanced = false
  }

  // Vérification des stats selon le type et la rareté
  const maxStatForRarity = maxStats[card.rarity as keyof typeof maxStats]
  if (card.type === 'Créature') {
    const totalStats = card.attack + card.defense
    if (totalStats > maxStatForRarity) {
      details.push(`⚠️ Stats totales trop élevées pour une carte ${card.rarity}`)
      isBalanced = false
    }
    if (card.attack === 0 && card.defense === 0) {
      details.push("⚠️ Stats trop faibles pour une créature")
      isBalanced = false
    }
  }

  if (isBalanced) {
    details.push("✅ Carte bien équilibrée")
  }

  return {
    isBalanced,
    score: powerScore,
    details,
    suggestions: Array.from(new Set(suggestions)) // Retirer les doublons
  }
}
const cardData = {
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




const CardTable = ({ title, cards, searchTerm }: { title: string; cards: Card[]; searchTerm: string }) => {
  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.effect.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (filteredCards.length === 0) return null

  const getRarityColor = (rarity: string): string => {
    switch (rarity.toLowerCase()) {
      case 'commune': return 'bg-gray-100'
      case 'rare': return 'bg-blue-50'
      case 'épique': return 'bg-purple-50'
      case 'légendaire': return 'bg-yellow-50'
      default: return 'bg-gray-50'
    }
  }

  const getTypeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'créature': return 'text-red-600'
      case 'sort': return 'text-blue-600'
      case 'arme': return 'text-green-600'
      case 'artefact': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Type</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Coût</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">ATT</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">DEF</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Rareté</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Effet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Équilibrage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCards.map((card, index) => {
              const balance = evaluateCardBalance(card)
              return (
                <tr key={index} className={getRarityColor(card.rarity)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {card.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${getTypeColor(card.type)}`}>
                      {card.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                    {card.cost}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={card.attack > 0 ? "text-red-600 font-bold" : "text-gray-400"}>
                      {card.attack || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={card.defense > 0 ? "text-blue-600 font-bold" : "text-gray-400"}>
                      {card.defense || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {card.rarity}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {card.effect}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-col gap-1">
                      <span className={`font-medium ${balance.isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                        Score: {balance.score}
                      </span>
                      {balance.details.map((detail, i) => (
                        <span key={i} className="text-xs">{detail}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const CardGame = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-[90rem] mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Collection de Cartes</h1>
        
        <div className="mb-8 flex justify-end">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Rechercher une carte..."
              className="w-full pl-10 pr-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        <CardTable title="Créatures" cards={cardData.creatures} searchTerm={searchTerm} />
        <CardTable title="Sorts" cards={cardData.spells} searchTerm={searchTerm} />
        <CardTable title="Équipement" cards={cardData.equipment} searchTerm={searchTerm} />
      </div>
    </div>
  )
}

export default CardGame