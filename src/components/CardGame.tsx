"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface Card {
  id: string;
  name: string;
  type: string;
  attack: number;
  defense: number;
  cost: number;
  effect: string;
  rarity: string;
}

const availableTypes = ["Créature", "Sort", "Arme", "Artefact"];
const availableRarities = ["Commune", "Rare", "Épique", "Légendaire"];

const cardData = {
  creatures: [
    { id: "1", name: "Guerrier Sombre", type: "Créature", attack: 8, defense: 7, cost: 5, effect: "Coup critique (50% de chances de doubler les dégâts)", rarity: "Rare" },
    { id: "2", name: "Golem de Pierre", type: "Créature", attack: 5, defense: 12, cost: 6, effect: "Réduction de dégâts (Réduit de moitié les dégâts physiques reçus)", rarity: "Commune" },
    { id: "3", name: "Dragon du Chaos", type: "Créature", attack: 12, defense: 8, cost: 7, effect: "Souffle infernal (Inflige 4 dégâts à tous les ennemis lorsqu'il attaque)", rarity: "Légendaire" },
    { id: "4", name: "Gobelin Malicieux", type: "Créature", attack: 4, defense: 3, cost: 2, effect: "Vole 1 point d'énergie", rarity: "Commune" },
    { id: "5", name: "Ange Gardien", type: "Créature", attack: 6, defense: 10, cost: 5, effect: "Soigne 3 points par tour", rarity: "Rare" },
  ],
  spells: [
    { id: "6", name: "Boule de Feu", type: "Sort", attack: 5, defense: 0, cost: 3, effect: "Inflige 5 dégâts", rarity: "Commune" },
    { id: "7", name: "Éclair Foudroyant", type: "Sort", attack: 7, defense: 0, cost: 4, effect: "Inflige 7 dégâts", rarity: "Rare" },
    { id: "8", name: "Protection Sacrée", type: "Sort", attack: 0, defense: 6, cost: 3, effect: "Protège un allié", rarity: "Commune" },
  ],
  equipment: [
    { id: "9", name: "Épée Runique", type: "Arme", attack: 6, defense: 0, cost: 4, effect: "Double les coups critiques", rarity: "Rare" },
    { id: "10", name: "Bouclier Sacré", type: "Artefact", attack: 0, defense: 8, cost: 5, effect: "Bloque 1 attaque puissante", rarity: "Rare" },
    { id: "11", name: "Arc Elfique", type: "Arme", attack: 4, defense: 0, cost: 3, effect: "Tire 2 flèches en 1 tour", rarity: "Commune" },
  ]
}

const calculatePowerScore = (card: Card): number => {
  let score = 0;
  
  // Score basé sur les stats
  score += card.attack * 2; // L'attaque vaut 2 points
  score += card.defense * 1.5; // La défense vaut 1.5 points

  // Bonus/Malus selon la rareté
  const rarityMultiplier = {
    'commune': 1,
    'rare': 1.2,
    'épique': 1.4,
    'légendaire': 1.6
  }[card.rarity.toLowerCase()] || 1;

  // Bonus/Malus selon les effets
  const effectComplexity = card.effect.split(' ').length / 5; // Plus l'effet est long, plus il est complexe
  score += effectComplexity * 2;

  // Application du multiplicateur de rareté
  score *= rarityMultiplier;

  return Math.round(score * 10) / 10;
}

const CardTable = ({ title, cards, searchTerm }: { title: string; cards: Card[]; searchTerm: string }) => {
  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.effect.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredCards.length === 0) return null;

  const getRarityColor = (rarity: string): string => {
    switch (rarity.toLowerCase()) {
      case 'commune': return 'bg-gray-100';
      case 'rare': return 'bg-blue-50';
      case 'épique': return 'bg-purple-50';
      case 'légendaire': return 'bg-yellow-50';
      default: return 'bg-gray-50';
    }
  }

  const getTypeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'créature': return 'text-red-600';
      case 'sort': return 'text-blue-600';
      case 'arme': return 'text-green-600';
      case 'artefact': return 'text-purple-600';
      default: return 'text-gray-600';
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
              const balanceScore = calculatePowerScore(card);
              return (
                <tr key={index} className={getRarityColor(card.rarity)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{card.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${getTypeColor(card.type)}`}>{card.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">{card.cost}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={card.attack > 0 ? "text-red-600 font-bold" : "text-gray-400"}>{card.attack || '-'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={card.defense > 0 ? "text-blue-600 font-bold" : "text-gray-400"}>{card.defense || '-'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{card.rarity}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{card.effect}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`font-medium ${balanceScore > 15 ? 'text-red-600' : 'text-green-600'}`}>
                      Score: {balanceScore}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const CardGame = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cards, setCards] = useState<Card[]>([
    ...cardData.creatures,
    ...cardData.spells,
    ...cardData.equipment
  ]);
  const [newCard, setNewCard] = useState<Card>({
    id: '',
    name: '',
    type: availableTypes[0],
    attack: 0,
    defense: 0,
    cost: 0,
    effect: '',
    rarity: availableRarities[0]
  });

  const addCard = () => {
    const cardWithId = { ...newCard, id: Date.now().toString() };
    setCards([...cards, cardWithId]);
    setNewCard({
      id: '',
      name: '',
      type: availableTypes[0],
      attack: 0,
      defense: 0,
      cost: 0,
      effect: '',
      rarity: availableRarities[0]
    });
  };

  const getRarityColor = (rarity: string): string => {
    switch (rarity.toLowerCase()) {
      case 'commune': return 'bg-gray-200';
      case 'rare': return 'bg-blue-200';
      case 'épique': return 'bg-purple-200';
      case 'légendaire': return 'bg-yellow-200';
      default: return 'bg-gray-200';
    }
  }

  const getTypeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'créature': return 'text-red-600';
      case 'sort': return 'text-blue-600';
      case 'arme': return 'text-green-600';
      case 'artefact': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  }

  const getAllCards = (): Card[] => {
    return cards.filter(card => {
      if (selectedType !== 'all' && card.type.toLowerCase() !== selectedType) return false;
      return card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             card.effect.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Collection de Cartes</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Ajouter une Carte</h2>
          <form className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Nom"
              value={newCard.name}
              onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
              className="p-2 border rounded"
            />
            <select
              value={newCard.type}
              onChange={(e) => setNewCard({ ...newCard, type: e.target.value })}
              className="p-2 border rounded"
            >
              {availableTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Attaque"
              value={newCard.attack}
              onChange={(e) => setNewCard({ ...newCard, attack: Number(e.target.value) })}
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Défense"
              value={newCard.defense}
              onChange={(e) => setNewCard({ ...newCard, defense: Number(e.target.value) })}
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Coût"
              value={newCard.cost}
              onChange={(e) => setNewCard({ ...newCard, cost: Number(e.target.value) })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Effet"
              value={newCard.effect}
              onChange={(e) => setNewCard({ ...newCard, effect: e.target.value })}
              className="p-2 border rounded"
            />
            <select
              value={newCard.rarity}
              onChange={(e) => setNewCard({ ...newCard, rarity: e.target.value })}
              className="p-2 border rounded"
            >
              {availableRarities.map((rarity) => (
                <option key={rarity} value={rarity}>{rarity}</option>
              ))}
            </select>
            <button type="button" onClick={addCard} className="p-2 bg-blue-500 text-white rounded">Ajouter</button>
          </form>
        </div>

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

        <CardTable title="Créatures" cards={cardData.creatures} searchTerm={searchTerm} />
        <CardTable title="Sorts" cards={cardData.spells} searchTerm={searchTerm} />
        <CardTable title="Équipement" cards={cardData.equipment} searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default CardGame;