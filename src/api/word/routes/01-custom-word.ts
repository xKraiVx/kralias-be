export default {
  routes: [
    {
      method: "GET",
      path: "/words/for-game",
      handler: "word.getWordsForGame",
    },
  ],
};
