interface Pokemon {
  name: string
  url: string
  isLoadingDetail: boolean,
  detail?: PokemonDetail
}

interface PokemonDetail {
  id: number
  sprites: {
    front_default: string
    other: {
      'official-artwork': {
        front_default: string
      }
    }
  }
  types: {
    type: {
      name: string
    }
  }[]
  height: number
  weight: number
  stats: {
    base_stat: number
    stat: {
      name: string
    }
  }[]
}

interface PokemonResponse {
  count: number
  next: string | null
  previous: string | null
  results: Pokemon[]
}

export const usePoke = () => {
  const pokemons = ref<Pokemon[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const totalPages = ref(0)
  const itemsPerPage = ref(10)
  const totalItems = ref(0)
  const error = ref<Error | undefined>(undefined);

  const fetchedDetail = ref<PokemonDetail>()

  const fetchList = async (page: number = 1) => {
    loading.value = true
    currentPage.value = page
    error.value = undefined

    try {
      const offset = (page - 1) * itemsPerPage.value
      const data = await $fetch<PokemonResponse>(
        `https://pokeapi.co/api/v2/pokemon?limit=${itemsPerPage.value}&offset=${offset}`
      )

      const newPokemons = data.results.map(pokemon => ({
        ...pokemon,
        isLoadingDetail: false
      }))
      
      if (page === 1) {
        pokemons.value = newPokemons
      } else {
        pokemons.value = [...pokemons.value, ...newPokemons]
      }

      totalItems.value = data.count
      totalPages.value = Math.ceil(data.count / itemsPerPage.value)

      // Fetch details for all new Pokemon
      newPokemons.forEach(async(pokemon) => {
        fetchDetail(pokemon.name)
      })
    } catch (err) {
      console.error('Failed to fetch pokemon list:', err);
      if(err instanceof Error) error.value = err;
      throw err;
    } finally {
      loading.value = false
    }
  }

  const fetchDetail = async (identifier: string) => {
    const pokemonIndex = pokemons.value.findIndex(p => {
      return p.name === identifier.toString()
    });

    const isPokemonOnState = pokemonIndex !== -1;

    try {
      if (isPokemonOnState) {
        pokemons.value[pokemonIndex].isLoadingDetail = true
      }

      const data = await $fetch<PokemonDetail>(
        `https://pokeapi.co/api/v2/pokemon/${identifier}`
      )

      fetchedDetail.value = data;
      
      if (isPokemonOnState) {
        pokemons.value[pokemonIndex].detail = data
      }
    } catch (err) {
      console.error('Failed to fetch pokemon detail:', err);
      throw err;
    } finally {
      pokemons.value[pokemonIndex].isLoadingDetail = false
    }
  }

  const nextPage = async () => {
    if (currentPage.value < totalPages.value) {
      return await fetchList(currentPage.value + 1)
    }
  }

  const previousPage = async () => {
    if (currentPage.value > 1) {
      return await fetchList(currentPage.value - 1)
    }
  }

  return {
    pokemons,
    fetchedDetail,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    fetchList,
    fetchDetail,
    nextPage,
    previousPage
  }
}