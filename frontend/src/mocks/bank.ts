import type { Accent } from '../types'

/**
 * Uma rodada do diálogo: a fala do interlocutor + um exemplo de resposta natural (vira uma
 * "resposta sugerida"; não é um gabarito). Com IA real (Fase 10) as falas serão geradas na hora
 * a partir da situação, do interlocutor, da cena, do nível e do sotaque; aqui o mock serve um
 * diálogo fixo de 4 a 6 rodadas por interlocutor, na ordem.
 */
export interface BankItem {
  /** Fala do interlocutor (inglês americano). */
  ai: string
  /** Exemplo de resposta natural a esta fala. */
  corrected: string
  /** Versão britânica, quando a fala ou a resposta muda de verdade. */
  uk?: { ai?: string; corrected?: string }
}

const t = (ai: string, corrected: string, uk?: BankItem['uk']): BankItem => ({ ai, corrected, uk })

/** Diálogos por interlocutor (id em src/data/scenarios.ts). */
export const BANK: Record<string, BankItem[]> = {
  // ---- Restaurante
  'restaurant-waiter': [
    t('Hi there, welcome! Can I start you off with something to drink?', "Yes, I'd like a glass of water, please."),
    t('Sure. Are you ready to order, or do you need a few more minutes?', "I'm ready. I'll have the grilled chicken, please."),
    t('Great choice. Would you like any sides with that?', 'Could I have a side salad instead of fries?', { ai: 'Great choice. Would you like any extras with that?', corrected: 'Could I have a side salad instead of chips?' }),
    t('How is everything tasting so far?', "It's delicious, thank you. Could we get some more water?"),
    t('Of course. Can I interest you in dessert, or just the check?', 'Just the check, please. Everything was great.', { ai: 'Of course. Would you like a dessert, or shall I bring the bill?', corrected: 'Just the bill, please. Everything was lovely.' }),
  ],
  'restaurant-cashier': [
    t('Hi! Was everything all right with your meal?', 'Yes, it was great, thank you. Could I pay now, please?'),
    t("Of course. That's forty-two dollars and fifty cents.", "Could we split it between the two of us, please?", { ai: "Of course. That's forty-two pounds and fifty pence.", corrected: 'Could we split it between the two of us, please?' }),
    t('No problem. Will you be paying by card or cash?', "By card, please. Here you go."),
    t('Would you like to add a tip? You can choose it on the screen.', 'Yes, I think ten percent is fine. How do I enter it?', { ai: 'Would you like to add a service charge? You can choose it on the screen.', corrected: 'Yes, ten percent is fine. How do I enter it?' }),
    t("All done. Do you need a receipt?", "Yes, please. Thank you, have a nice evening."),
  ],
  'restaurant-host': [
    t('Good evening! Do you have a reservation?', 'Yes, I have a reservation for two under Silva.', { ai: 'Evening! Have you booked a table?', corrected: 'Yes, I booked a table for two under Silva.' }),
    t("Let me check... I see it. I'm afraid your table isn't quite ready yet.", 'How long will the wait be?'),
    t("About ten minutes. You're welcome to wait at the bar if you like.", "That's fine. Could we sit outside, if there's a table?"),
    t("Let me see. There's one on the patio, but it's a little cool tonight.", "That's okay. We'd prefer the patio."),
    t("Perfect. I'll let you know as soon as it's ready.", 'Thank you very much. We will be at the bar.'),
  ],
  'restaurant-delivery': [
    t('Thank you for calling Mario\'s Kitchen. What can I get for you today?', "Hi, I'd like to order a large pepperoni pizza, please."),
    t('Anything else? Our garlic bread is very popular.', "Yes, one garlic bread and a bottle of soda, please."),
    t("Got it. What's the delivery address?", "It's twelve Maple Street, apartment four."),
    t('Thanks. Will you pay by card online, or in cash to the driver?', "I'll pay in cash. Do you have change for a fifty?"),
    t('Sure. It will take about thirty-five minutes. Can I have a phone number in case the driver gets lost?', "Of course. It's five five five, oh one two three."),
  ],

  // ---- Conversa na rua
  'street-local': [
    t('Hi! Are you lost? Do you need some help?', 'Yes, please. Where is the bus station?', { ai: 'Hello! Are you lost? Do you need a hand?', corrected: 'Yes, please. Where is the bus station?' }),
    t('Go straight, then turn left at the bank. It is about five minutes on foot.', 'Great, thanks. Is there a good place to eat near there?'),
    t("Are you from around here? I haven't seen you before.", "No, I'm visiting from Brazil. I arrived two days ago."),
    t("If you like coffee, there's a great place just around the corner.", 'That sounds nice. Could you tell me how to get there?', { ai: "If you like coffee, there's a lovely café just round the corner.", corrected: 'That sounds nice. Could you tell me how to get there?' }),
    t("You can't miss it. It's right across from the pharmacy, next to the bookshop with the green door.", 'Perfect, I think I know where that is. Thanks a lot!', { ai: "You can't miss it. It's opposite the chemist's, next to the bookshop with the green door.", corrected: 'Perfect, I think I know where that is. Thanks a lot!' }),
  ],
  'street-tourist': [
    t("Excuse me, do you speak English? I'm a little lost.", "Yes, I do. Where do you want to go?"),
    t("I'm looking for the city museum. Is it far from here?", "Not really. It's about ten minutes on foot."),
    t('Oh, good. Which way should I go?', 'Go straight to the end of this street, then turn right at the church.'),
    t('Thank you! Is there a good place nearby to have lunch?', "Yes, there's a small restaurant next to the museum. The soup is great."),
    t("That sounds perfect. I really appreciate your help!", "You're welcome. Enjoy your visit!"),
  ],

  // ---- Aeroporto
  'airport-checkin': [
    t('Good morning. May I see your passport, please?', 'Of course. Here you are.'),
    t('Thank you. Are you checking any bags today?', 'Yes, one suitcase.'),
    t('Please place it on the scale. Would you like a window seat or an aisle seat?', "I'd prefer a window seat, please."),
    t("All set. Your flight leaves from gate twelve, and boarding starts at ten thirty.", 'Thank you. Where can I find gate twelve?'),
    t('Past security, then follow the signs to the right. Have a pleasant flight!', 'Thank you very much. Goodbye!'),
  ],
  'airport-security': [
    t('Next, please. Do you have any liquids in your bag?', 'Yes, I have a small bottle of water and some perfume.'),
    t('Please place your laptop and liquids in the tray.', 'Should I take off my shoes and my belt too?'),
    t('Yes, shoes and belt, please. Empty your pockets as well.', 'Okay. I only have my phone and my keys.'),
    t("Thank you. I'm going to have to check your bag again. Is there anything sharp inside?", "No, nothing sharp. Maybe it's the charger."),
    t("You're all set. Sorry for the delay. Have a good flight.", 'No problem. Thank you!'),
  ],
  'airport-immigration': [
    t('Good afternoon. Passport, please. What is the purpose of your visit?', "I'm here on vacation."),
    t('How long are you planning to stay?', "I'm staying for two weeks."),
    t('And where will you be staying during your trip?', "I'll be at a hotel downtown. I have the reservation here."),
    t('Is this your first time visiting?', "Yes, it's my first time here. I'm very excited."),
    t('Welcome! Enjoy your stay.', 'Thank you very much.'),
  ],
  'airport-gate': [
    t("Attention, passengers. Flight 208 has been delayed by forty minutes.", "Excuse me, do you know the new departure time?", { ai: 'Attention, passengers. Flight 208 has been delayed by forty minutes. Please keep an eye on the departures board.', corrected: 'Excuse me, do you know the new departure time?' }),
    t('Boarding will now start at eleven fifteen. Is there anything I can help you with?', "Yes. I'd like to change my seat, if possible."),
    t('Let me check. I can offer you an aisle seat in row fourteen.', "That's fine, thank you. Is it near the front?"),
    t("It's about halfway back. Here is your new boarding pass.", 'Thanks. Do I need to be at the gate early?'),
    t("Please be here at eleven. We'll call your row when it's time.", "Great, I'll be here. Thank you for your help."),
  ],
  'airport-baggage': [
    t("Hello. How can I help you?", "My suitcase didn't arrive on the carousel."),
    t('I am sorry to hear that. Can I see your baggage tag and boarding pass?', 'Here you are. I was on the flight from São Paulo.'),
    t('Thank you. Can you describe the suitcase?', "It's a large blue suitcase with a red ribbon on the handle."),
    t("Got it. We'll try to find it. Where should we deliver it when we do?", "To my hotel, please. It's the Riverside Hotel, room three oh four."),
    t("We'll call you within twenty-four hours. Here is your reference number.", 'Thank you. Is there any compensation for the delay?'),
  ],

  // ---- Hotel
  'hotel-reception': [
    t('Good afternoon, and welcome to the Riverside Hotel. How may I help you?', "Hi, I'd like to check in. I have a reservation under Silva."),
    t('Let me see... Yes, a double room for three nights. May I see your passport?', 'Of course. Here you go.'),
    t('Thank you. Breakfast is served from seven to ten on the second floor.', 'Great. And what time is checkout?'),
    t('Checkout is at eleven. Your room is on the fourth floor. The lift is just around the corner.', 'Thank you. Could I get a late checkout?', { ai: 'Checkout is at eleven. Your room is on the fourth floor, which is the fifth if you count the ground floor. The lift is around the corner.', corrected: 'Thank you. Could I get a late checkout?' }),
    t('We can do twelve thirty at no extra charge. Anything else you need?', "No, that's all. Thank you very much."),
  ],
  'hotel-housekeeping': [
    t('Good morning! Would you like me to clean your room now?', "Yes, please. I'm about to go out."),
    t('Of course. Do you need anything else, like extra towels?', 'Yes, could I have two more towels, please?'),
    t('Sure. Would you also like fresh pillows or another blanket?', "One more blanket would be great. It's a little cold at night."),
    t("No problem. I'll bring it in a few minutes. Is the air conditioning working properly?", "Actually, it's a bit noisy. Could someone take a look?"),
    t("I'll let maintenance know right away. Have a nice day!", 'Thank you very much.'),
  ],
  'hotel-roomservice': [
    t('Room service, good evening. How can I help you?', "Hi, I'd like to order dinner to my room, please. This is room four twelve."),
    t('Certainly. What would you like to order?', "I'll have the vegetarian pasta and a green salad."),
    t('Any allergies or special requests we should know about?', "Yes, I'm allergic to nuts. Please make sure there are none."),
    t('Of course. Anything to drink?', 'A bottle of sparkling water, please.'),
    t("That will be thirty-eight dollars, and it will arrive in about twenty-five minutes. Shall I charge it to your room?", "Yes, please charge it to my room. Thank you."),
  ],
  'hotel-concierge': [
    t('Good morning! How can I help you today?', "Hi, it's my first day here. What do you recommend visiting?"),
    t("The old town is lovely, and there's a free walking tour that leaves at ten.", 'That sounds great. Where does the tour start?'),
    t('It starts at the main square, about fifteen minutes from the hotel.', 'Is it better to walk or take a taxi?'),
    t('The bus is cheap and easy. The number twelve stops right in front of the hotel.', "Perfect. And is there a good place for lunch near the square?", { ai: 'The bus is cheap and easy. The number twelve stops right outside the hotel.', corrected: 'Perfect. And is there a good place for lunch near the square?' }),
    t("Yes, there's a small family restaurant. I can make a reservation for you.", 'That would be wonderful. A table for two at one, please.'),
  ],

  // ---- Compras
  'shopping-clerk': [
    t('Hi! Let me know if you need any help finding something.', "Thanks. I'm looking for a jacket."),
    t('We have a few new ones here. What size are you?', "I'm a medium. Do you have this one in black?"),
    t('Let me check. It comes in black and navy. Would you like to try it on? The fitting rooms are just over there.', 'Yes, please. Where are the fitting rooms?', { ai: 'Let me check. It comes in black and navy. Would you like to try it on? The changing rooms are just over there.', corrected: 'Yes, please. Where are the changing rooms?' }),
    t('How does it fit?', "It's a little tight. Do you have a large?"),
    t("I'll bring you one right away. That jacket is also on sale today.", 'Great! How much is it with the discount?'),
  ],
  'shopping-cashier': [
    t('Hi! Did you find everything you were looking for?', 'Yes, thank you. Just these two shirts.'),
    t("That comes to sixty dollars with the discount. Would you like to pay by card or cash?", "I'll pay by card, please.", { ai: 'That comes to sixty pounds with the discount. Would you like to pay by card or cash?', corrected: "I'll pay by card, please." }),
    t('You can insert your card here. Would you like a bag? It costs ten cents.', "Yes, one bag, please."),
    t('Do you want the receipt in the bag or by email?', 'By email, please. My address is on the screen.'),
    t('All done. Remember, you can return items within thirty days.', "Good to know. Thank you, have a nice day."),
  ],
  'shopping-returns': [
    t('Hello. How can I help you?', "Hi, I'd like to return this sweater. It doesn't fit."),
    t('Sure. Do you have the receipt with you?', 'Yes, here it is. I bought it last week.'),
    t('Thank you. Would you like a refund or an exchange?', "Could I exchange it for a bigger size?"),
    t("I'm sorry, we're out of that size in this color. We have it in gray, or I can give you a refund.", "I'd prefer a refund, please."),
    t("No problem. The refund will go back to your card in three to five business days.", 'Thank you. That is perfect.'),
  ],

  // ---- Entrevista de emprego
  'interview-hr': [
    t("Good morning, and thank you for coming. Please, have a seat. Could you tell me a little about yourself?", "Thank you. I'm a marketing assistant with three years of experience, and I love working with data."),
    t("That's great. What attracted you to this position?", "I admire your company's projects, and I'd like to grow in a creative team."),
    t('What would you say is your biggest strength?', "I'm very organized, and I always meet my deadlines."),
    t('And how do you handle a situation when you disagree with a colleague?', 'I listen carefully first, and then we look for a solution together.'),
    t('Do you have any questions for us?', 'Yes. What does a typical day look like in this role?'),
  ],
  'interview-lead': [
    t("Thanks for joining. I'd like to understand how you work. Could you describe a project you are proud of?", 'Last year I led a small team that launched a new website two weeks early.'),
    t('Interesting. What was the biggest challenge in that project?', 'We had a tight budget, so we had to prioritize the most important features.'),
    t('Suppose a client changes the requirements on the last day. What would you do?', "I would talk to the client, explain the impact on the schedule, and propose a realistic plan."),
    t("Good answer. How do you keep up with new tools and trends in the field?", 'I read articles every week and I take online courses.'),
    t("Great. When could you start if you were offered the position?", 'I could start in about a month, after my notice period.'),
  ],
  'interview-phone': [
    t("Hello, this is the hiring team at Brightway. Is this a good time to talk?", "Yes, it's a good time. Thank you for calling."),
    t('Great. I have your resume here. Could you briefly summarize your experience?', 'I have four years in customer service, mostly in tech companies.'),
    t('Are you currently working?', "Yes, but I'm looking for a new challenge."),
    t('The role is full time, starting next month. Is that something that works for you?', "Yes, that works. What are the working hours?"),
    t("From nine to six, with a hybrid schedule. We'll contact you by email about the next step.", 'Perfect. Thank you very much for your time.'),
  ],

  // ---- Bate-papo virtual
  'chat-coworker': [
    t("Hey! Sorry to message you on a Sunday. Did you get a chance to look at the report?", "Hi! Yes, I read it this morning. It looks good."),
    t('Awesome. Could you send me the final numbers before the meeting tomorrow?', "Sure, I'll send them tonight."),
    t("Thanks, you're a lifesaver. Oh, and can you take notes in the meeting? I have another call at the same time.", "Of course, no problem."),
    t("Perfect. By the way, are we still having lunch together on Wednesday?", "Yes, let's meet at noon at the usual place."),
    t('Sounds good. See you tomorrow!', 'See you! Have a nice evening.'),
  ],
  'chat-friend': [
    t("Hey! It's been forever. How are you? So much has happened since we last talked.", "Hi! I'm great, thanks. Tell me everything!"),
    t('I finally got a new job! I start next month, and I am so excited.', "That's amazing news! Congratulations!"),
    t("Thanks! Anyway, what are you doing this weekend? I was thinking we could do something fun.", "I don't have any plans yet. What did you have in mind?"),
    t("How about hiking on Saturday? The weather looks perfect.", "That sounds great. What time should we meet?"),
    t("Let's say nine at the trailhead, and we can grab lunch afterwards.", "Perfect, it's a plan. See you Saturday!"),
  ],
  'chat-course': [
    t("Hi! It's me from the English course. How are the lessons going for you?", "Hi! They're going well, but the listening exercises are hard."),
    t("I know what you mean. I started watching series with subtitles, and it really helped.", "That's a good idea. Which series do you watch?"),
    t("I love a comedy about a group of friends. The language is easy to follow.", "I'll try it this week. Are you ready for the test on Friday?"),
    t("Not really. I still need to review the grammar. Do you want to study together online?", 'Yes, I would love that. When are you free?'),
    t("How about tomorrow after work? Around seven?", "Seven works for me. Talk to you then!"),
  ],
  'chat-hostfamily': [
    t("Hello! We're your host family, and we are so happy that you're coming. How was your day?", "Hi! Thank you so much. It's nice to meet you all."),
    t("We're getting your room ready. Is there any food you don't like, or any allergies?", "I don't eat pork, and I'm allergic to peanuts."),
    t("No problem, we'll keep that in mind. What time does your flight arrive on Saturday?", 'It arrives at six in the evening. I will send you the flight number.'),
    t("Perfect. We will pick you up at the airport. Is there anything you would like to do on your first day?", "I'd love to see the neighborhood and try some local food."),
    t("We'll take you out for a nice dinner. Safe travels, and see you soon!", 'Thank you so much. I cannot wait to meet you!'),
  ],
}

/** Resolve a fala para o sotaque da sessão (aplica a versão britânica quando existe). */
export function resolveItem(item: BankItem, accent: Accent) {
  const uk = accent === 'en-GB' ? item.uk : undefined
  return {
    ai: uk?.ai ?? item.ai,
    corrected: uk?.corrected ?? item.corrected,
  }
}
