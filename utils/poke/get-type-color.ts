export const getTypeColor = (type?: string) => {
  const colors = {
    '_default': '#A8A878',
    'grass': '#78C850',
    'fire': '#F08030',
    'water': '#6890F0',
    'electric': '#F8D030',
    'poison': '#A040A0',
    'flying': '#A890F0',
    'normal': '#A8A878',
    'fighting': '#C03028',
    'psychic': '#F85888',
    'ground': '#E0C068',
    'rock': '#B8A038',
    'bug': '#A8B820',
    'ghost': '#705898',
    'steel': '#B8B8D0',
    'dragon': '#7038F8',
    'dark': '#705848',
    'fairy': '#EE99AC',
    'ice': '#98D8D8',
  };

  const typeKey = type || "_default";
  return colors[typeKey as keyof typeof colors];
};