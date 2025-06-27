export const languages = ['English', 'Amharic', 'French', 'Spanish', 'German', 'Chinese', 'Russian', 'Italian', 'Latin'];

export const genres = [
  { category: "Fiction", items: ['Fiction', 'Fantasy', 'Science Fiction', 'Historical Fiction', 'Romance', 'Thriller', 'Horror'] },
  { category: "Non-Fiction", items: ['Biography', 'Business', 'History', 'Memoir', 'Nonfiction', 'Psychology', 'Self Help'] },
  { category: "Art & Literature", items: ['Art', 'Classics', 'Poetry'] },
  { category: "Special Interest", items: ['Children\'s', 'Christian', 'Cookbooks', 'Humor', 'Music', 'Sports', 'Travel', 'Young Adult'] }
];

export const ageGroups = [
  { label: "Kids (0–12)", value: "kids" },
  { label: "Teens (13–17)", value: "teens" },
  { label: "Young Adults (18–24)", value: "young-adults" },
  { label: "Adults (25–40)", value: "adults" },
  { label: "Older Adults (41+)", value: "older-adults" }
];

export const bookLengths = [
  { label: "Short (under 150 pages)", value: "short" },
  { label: "Medium (150–300 pages)", value: "medium" },
  { label: "Long (300+ pages)", value: "long" }
];

// A flattened array of all genre strings for easier use in the settings page
export const allGenreItems = genres.flatMap(category => category.items);