import animals from "../../seed-objects/words/animals.json";
import geography from "../../seed-objects/words/geography.json";
import biology from "../../seed-objects/words/biology.json";
import movies from "../../seed-objects/words/movies.json";

module.exports = {
  async up(knex) {
    const categories = {
      en: [
        "Biology",
        "Programming",
        "Fairy Tales",
        "Animals",
        "Movies",
        "Music",
        "Books",
        "Science",
        "Technology",
        "For Adults",
        "Harry Potter",
        "Creativity",
        "Art",
        "Sports",
        "Travel",
        "Space",
        "Nature",
        "History",
        "Philosophy",
        "Psychology",
        "Sociology",
        "Economics",
        "Politics",
        "Geography",
        "Mathematics",
        "Physics",
        "Chemistry",
      ],
      uk: [
        "Біологія",
        "Програмування",
        "Казки",
        "Тварини",
        "Фільми",
        "Музика",
        "Книги",
        "Наука",
        "Технології",
        "Для дорослих",
        "Гаррі Поттер",
        "Творчість",
        "Мистецтво",
        "Спорт",
        "Подорожі",
        "Космос",
        "Природа",
        "Історія",
        "Філософія",
        "Психологія",
        "Соціологія",
        "Економіка",
        "Політика",
        "Географія",
        "Математика",
        "Фізика",
        "Хімія",
      ],
    };

    const date = new Date();

    interface IWord {
      category_id: number;
      word: string;
    }

    interface ILocalizedWord {
      en: IWord;
      uk: IWord;
    }

    const localizedWordsArray: ILocalizedWord[] = [
      ...animals,
      ...geography,
      ...biology,
      ...movies,
    ];

    //#region Seeding categories

    const categoriesToSeed = Object.keys(categories).reduce((acc, lang) => {
      const langCategories = (categories[lang] as string[]).map(
        (category, idx) => ({
          document_id: idx + 1,
          slug: categories.en[idx].toLowerCase().replace(/\s+/g, "-"),
          name: category,
          created_at: date,
          updated_at: date,
          published_at: date,
          created_by_id: 1,
          updated_by_id: 1,
          locale: lang,
        })
      );
      return acc.concat(langCategories);
    }, []);

    await knex("categories").insert(categoriesToSeed);

    //#endregion

    // #region Seeding words

    const wordsToSeed = localizedWordsArray.reduce(
      (acc, localizedWord, idx) => {
        const words: [string, IWord][] = Object.entries(localizedWord);

        const localizedWordsToSeed = words.map(([lang, word]) => {
          return {
            document_id: idx + 1,
            name: word.word,
            created_at: date,
            updated_at: date,
            published_at: date,
            created_by_id: 1,
            updated_by_id: 1,
            locale: lang,
          };
        });

        localizedWordsToSeed.forEach((word) => {
          acc.push(word);
        });

        return acc;
      },
      []
    );

    await knex("words").insert(wordsToSeed);
    // #endregion

    //#region Seeding link between categories and words

    const linkCategoryAndWordToSeed = localizedWordsArray.reduce(
      (acc, localizedWord, wordIdx) => {
        const words: IWord[] = Object.values(localizedWord);

        const localizedWordsToSeed = words.map((word, localizationIdx) => {
          const indexOfWord = wordIdx + 1;
          const indexOfLocalization = localizationIdx + 1;

          const categoryId = word.category_id;
          const wordId =
            indexOfWord * words.length - (words.length - indexOfLocalization);

          return {
            category_id: categoryId,
            word_id: wordId,
          };
        });

        localizedWordsToSeed.forEach((word) => {
          acc.push(word);
        });

        return acc;
      },
      []
    );

    await knex("words_categories_lnk").insert(linkCategoryAndWordToSeed);

    //#endregion
  },
};
