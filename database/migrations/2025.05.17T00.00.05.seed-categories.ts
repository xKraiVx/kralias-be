module.exports = {
  async up(knex) {
    const categories = {
      en: [
        "Short Words",
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
        "Biology",
      ],
      uk: [
        "Короткі слова",
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
        "Біологія",
      ],
    };

    const data = new Date();

    const dataToSeed = Object.keys(categories).reduce((acc, lang) => {
      const langCategories = (categories[lang] as string[]).map(
        (category, idx) => ({
          document_id: idx + 1,
          slug: categories.en[idx].toLowerCase().replace(/\s+/g, "-"),
          name: category,
          created_at: data,
          updated_at: data,
          published_at: data,
          created_by_id: 1,
          updated_by_id: 1,
          locale: lang,
        })
      );
      return acc.concat(langCategories);
    }, []);

    await knex("categories").insert(dataToSeed);
  },
};
