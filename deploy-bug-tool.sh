#!/bin/bash
# Швидкий деплой Bug Report Tool

echo "🚀 Деплой Bug Report Tool"
echo "=========================="
echo ""

echo "📦 Крок 1: Деплой Firestore Rules..."
firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    echo "✅ Firestore rules задеплоєно успішно!"
    echo ""
    echo "📝 Наступні кроки:"
    echo "1. Відкрийте Firebase Console: https://console.firebase.google.com/"
    echo "2. Firestore Database → Виберіть користувача"
    echo "3. Додайте поле: isAdmin: true (або isTester: true)"
    echo "4. Перезавантажте сайт - побачите кнопку 🐛"
    echo ""
    echo "📖 Повна документація: docs/BUG_REPORT_TOOL_SETUP.md"
else
    echo "❌ Помилка деплою! Перевірте Firebase CLI."
    exit 1
fi
