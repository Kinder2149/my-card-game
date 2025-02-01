'use client'

import React, { useState } from 'react'
import { Search } from 'lucide-react'

interface Card {
  name: string
  type: string
  attack: number
  defense: number
  cost: number
  effect: string
  rarity: string
}

interface CardData {
  creatures: Card[]
  spells: Card[]
  equipment: Card[]
}

const cardData: CardData = {
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
const calculatePowerScore = (card: Card): number => {
  let score = 0;
  
  // Score basé sur les stats
  score += card.attack * 2  // L'attaque vaut 2 points
  score += card.defense * 1.5  // La défense vaut 1.5 points

  // Bonus/Malus selon la rareté
  const rarityMultiplier = {
    'commune': 1,
    'rare': 1.2,
    'épique': 1.4,
    'légendaire': 1.6
  }[card.rarity.toLowerCase()] || 1

  // Bonus/Malus selon les effets
  const effectComplexity = card.effect.split(' ').length / 5  // Plus l'effet est long, plus il est complexe
  score += effectComplexity * 2

  // Application du multiplicateur de rareté
  score *= rarityMultiplier

  return Math.round(score * 10) / 10
}

const CardGame = () => {
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')

  const getRarityColor = (rarity: string): string => {
    switch (rarity.toLowerCase()) {
      case 'commune': return 'bg-gray-200'
      case 'rare': return 'bg-blue-200'
      case 'épique': return 'bg-purple-200'
      case 'légendaire': return 'bg-yellow-200'
      default: return 'bg-gray-200'
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

  const getAllCards = (): Card[] => {
    return [...cardData.creatures, ...cardData.spells, ...cardData.equipment]
      .filter(card => {
        if (selectedType !== 'all' && card.type.toLowerCase() !== selectedType) return false
        return card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               card.effect.toLowerCase().includes(searchTerm.toLowerCase())
      })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Collection de Cartes</h1>
        
        <div className="mb-8 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-4">
            <button 
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded ${selectedType === 'all' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            >
              Tous
            </button>
            <button 
              onClick={() => setSelectedType('créature')}
              className={`px-4 py-2 rounded ${selectedType === 'créature' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            >
              Créatures
            </button>
            <button 
              onClick={() => setSelectedType('sort')}
              className={`px-4 py-2 rounded ${selectedType === 'sort' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            >
              Sorts
            </button>
            <button 
              onClick={() => setSelectedType('arme')}
              className={`px-4 py-2 rounded ${selectedType === 'arme' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            >
              Armes
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une carte..."
              className="pl-10 pr-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getAllCards().map((card, index) => (
            <div 
              key={index}
              className={`rounded-lg overflow-hidden shadow-lg ${getRarityColor(card.rarity)} hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">{card.name}</h2>
                  <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold">
                    Coût: {card.cost}
                  </span>
                </div>
                
                <div className="mb-4">
                  <span className={`font-medium ${getTypeColor(card.type)}`}>
                    {card.type}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="text-gray-600">{card.rarity}</span>
                </div>

                <div className="flex gap-4 mb-4">
                  {card.attack > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-red-600">{card.attack}</span>
                      <span className="text-sm text-gray-600">ATT</span>
                    </div>
                  )}
                  {card.defense > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-600">{card.defense}</span>
                      <span className="text-sm text-gray-600">DEF</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-700">{card.effect}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CardGame