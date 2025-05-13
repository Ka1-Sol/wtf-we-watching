// Limita il numero di risultati convertiti per motivi di prestazioni - massimo 20
return response.data.results.slice(0, 20).map(convertMovieToContent); 