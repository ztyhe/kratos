require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');

// Запуск веб-сервера для Render
function keepAlive() {
    const app = express();
    app.get('/', (req, res) => res.send('Бот работает!'));
    app.listen(3000, () => console.log('✅ Веб-сервер запущен'));
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ID пользователей
const USER_IDS = {
    'максим': '1312779895499132963',
    'артем': '587992562443354122',
    'никс': '905077323311775774',
    'юра': '839559638516236298'
};

// Ответы
const RESPONSES = {
    'максим': [
        "Потряси своими мопсярками, собакин", "Нищий верс СЯО сосёт мне, как и твоя мать", "Я твоей матери под хвост пускал, блядёныш", "Собакину слова не давали",
        "Максик, айда ко мне попрыгаешь на моём писюнчике", "Ай максимка, ай да сукин сын.", "Максим твой батя нищий пидорас, от него жена ушла из-за 200 рублей", "Пошёл отсюда нахуй, собакен",
        "Максим, всем похуй на тебя, я ебал твою мать", "Я обмазываю хуй паштетом, максик, который голодный))))", "Что случилось, мопсик, мать сдохла?", "Я надеюсь ты умрёшь в муках, собачье ты дитя!!!"
    ],
    'артем': [
        "💀 Йогири мой раб, а ты кто такой?", "👀 Артём, не играй в доту, у тебя нет шансов!", "🔥 Я твоего хускара рот ебал.",
        "🥶 Козах мид пикает хускара + йогири против меня, хаха очевидно я насрал обоим в рот)", "Ойдадыр глаза шире открой",
        "Чел, чё скажешь, а ладно всем похуй на тебя", "Го отскочим, побормочим", "Шалом", "Дефир сильнее тебя, бущенное чмо",
        "Тупая общажная сучка", "Я ебашил твой сервер, чё скажешь?", "Чел, чё скажешь, а ладно всем похуй на тебя",
        "Привет Артём, просто казахский сын шалавы", "Выебал нищий верс йогири, я крутой"
    ],
    'никс': [
        "👑 Гильгамеш, упал на колени и сосёт мне", "🎭 Никс, когда некст на магнусе?", "🔥 Ты никто в этом мире",
        "🛡 Твоя Сейбер теперь моя шлюха, прими это!", "Чел, я реально насрал в рот твоему нищему верс фейту",
        "Я ёбырь сейбер, привет", "Никс, это я был той бабкой, которая ссала на улице", "О да и да ё",
        "Широ эмия берёт в рот, как и весь нищий верс фейта", "Я реально крутой, а ты нет",
        "Никс, давай на бой в клеш рояль, я твою деку трахну своими шустрыми джентельменами (кратосами)",
        "Скибиди папа показал пенис бабуле"
    ],
    'юра': [
        "Алё, здарова юрас, как житуха, а ладно мне похуй, я твою мать просто ебал, а батю петушил", "Заткнись, инцел",
        "Зачем лизал пизду Емек?", "Я не заправлю тебе ашкудишку, лысое чмо", "Бедкурт твой ёбырь", "Я угнал твою моторолу",
        "Анекдот: Флоучик пришёл в ПТУ и стал дауном", "Почему отец на зоне?", "Я ебал твой кальян", "Я срал в твой папирос",
        "Кто сильнее? Бедкурт с одной рукой или ты со своей бандой олухов", "Я пёрнул, ты понюхал!"
    ]
};

// Гифки (ссылки)
const GIFS = {
    'максим': "https://i.imgur.com/tj1lKYD.gif",
    'артем': "https://i.imgur.com/dp6JBMF.gif",
    'никс': "https://i.imgur.com/tj1lKYD.gif",
    'юра': "https://i.imgur.com/Asw4vi1.gif"
};

// Хранение времени последнего ответа
const lastReplyTime = {};

// Бот готов
client.once('ready', () => {
    console.log(`✅ Бот запущен как ${client.user.tag}`);
});

// Функция скачивания гифки и отправки как файла
async function sendHiddenGif(channel, url) {
    try {
        const file = new AttachmentBuilder(url);
        await channel.send({ files: [file] });
    } catch (error) {
        console.error("Ошибка при отправке гифки:", error);
    }
}

// Обработка сообщений
client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const user_id = message.author.id;
    const text = message.content.toLowerCase();

    if (Object.values(USER_IDS).includes(user_id)) {
        const user_name = Object.keys(USER_IDS).find(key => USER_IDS[key] === user_id);

        const now = Date.now();
        // Увеличиваем кулдаун до 60 секунд (60000 миллисекунд)
        if (lastReplyTime[user_id] && now - lastReplyTime[user_id] < 60000) return;
        lastReplyTime[user_id] = now;

        // Выбор ответа
        const response = RESPONSES[user_name][Math.floor(Math.random() * RESPONSES[user_name].length)];
        const gif = GIFS[user_name];

        // Ответ на сообщение
        await message.reply(response);
        await sendHiddenGif(message.channel, gif);
    }
});

// Запуск
keepAlive();
client.login(process.env.DISCORD_TOKEN);
