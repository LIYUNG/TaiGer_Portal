const { Schema } = require('mongoose');

const keywordSetSchema = new Schema(
  {
    categoryName: {
      type: String
    },
    description: {
      type: String,
      default: '',
      validate: {
        validator: function (value) {
          // Maximum allowed length
          return value.length <= 3000;
        },
        message:
          'Description exceeds the maximum allowed length of 3000 characters'
      }
    },
    keywords: {
      zh: [
        {
          type: String,
          default: ''
        }
      ],
      en: [
        {
          type: String,
          default: ''
        }
      ]
    },
    antiKeywords: {
      zh: [
        {
          type: String,
          default: ''
        }
      ],
      en: [
        {
          type: String,
          default: ''
        }
      ]
    }
  },
  { timestamps: true }
);

keywordSetSchema.index({ categoryName: 1 });

module.exports = { keywordSetSchema };
