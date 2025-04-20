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
  const fetchedDetail = ref<PokemonDetail>()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(0)
  const itemsPerPage = ref(10)
  const totalItems = ref(0)

  const fetchList = async (page: number = 1) => {
    loading.value = true
    error.value = null
    currentPage.value = page

    try {
      const offset = (page - 1) * itemsPerPage.value
      const { data, error: fetchError } = await useFetch<PokemonResponse>(
        `https://pokeapi.co/api/v2/pokemon?limit=${itemsPerPage.value}&offset=${offset}`
      )

      if (fetchError.value) {
        throw new Error(fetchError.value.message)
      }

      if (data.value) {
        const newPokemons = data.value.results.map(pokemon => ({
          ...pokemon,
          isLoadingDetail: false
        }))
        
        // If it's the first page, replace the list
        // Otherwise, append to the existing list
        if (page === 1) {
          pokemons.value = newPokemons
        } else {
          pokemons.value = [...pokemons.value, ...newPokemons]
        }

        totalItems.value = data.value.count
        totalPages.value = Math.ceil(data.value.count / itemsPerPage.value)

        // Fetch details for all new Pokemon
        newPokemons.forEach(async(pokemon) => {
          fetchDetail(pokemon.name)
        })
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch pokemons'
    } finally {
      loading.value = false
    }
  }

  const fetchDetail = async (identifier: string) => {
    const pokemonIndex = pokemons.value.findIndex(p => {
      return p.name === identifier.toString()
    });

    const isMonsterOnState = pokemonIndex !== -1;

    try {
      if (isMonsterOnState) {
        pokemons.value[pokemonIndex].isLoadingDetail = true
      }

      const { data, error: fetchError } = await useFetch<PokemonDetail>(
        `https://pokeapi.co/api/v2/pokemon/${identifier}`
      )

      if (fetchError.value) {
        throw new Error(fetchError.value.message)
      }

      if (data.value) {
        fetchedDetail.value = data.value;
        
        if (pokemonIndex !== -1) {
          pokemons.value[pokemonIndex].isLoadingDetail = false
          pokemons.value[pokemonIndex].detail = data.value
        }
      }
    } catch (err) {
      console.error('Failed to fetch pokemon detail:', err);

      if (isMonsterOnState) {
        pokemons.value[pokemonIndex].isLoadingDetail = false
      }
    }
  }

  const nextPage = async () => {
    if (currentPage.value < totalPages.value) {
      await fetchList(currentPage.value + 1)
    }
  }

  const previousPage = async () => {
    if (currentPage.value > 1) {
      await fetchList(currentPage.value - 1)
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