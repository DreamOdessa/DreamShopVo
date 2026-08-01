-- Generated from the live legacy Firestore catalog.
-- Media URLs are intentionally excluded; new images are managed through R2.
begin;

insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)
values ('4BvE5z3CWeH9aouEVjvf','Прикраси для коктейлів','decorations','Съедобні квіти та декоративні елементи для прикраси напоїв',true,false,2)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;

insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)
values ('6FWMLusTN8Bc35okugkt','Фруктові чіпси','chips','Хрусткі органічні фруктові чіпси для перекусу та прикраси страв',true,true,1)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;

insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)
values ('83HwZcvQJ2ynOAd7f1Ak','Ізомальт','izomalt','',true,false,1)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;

insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)
values ('BXi5eqgQOCaiz62iOWmh','Квітковий','kvitkovyi','',true,false,0)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;

insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)
values ('C3pj7gljtuOxzNaOhGOH','Льон','lon','',true,false,0)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;

insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)
values ('CH6xyehY1T7XgoQ27u0n','Distill','distill','',true,false,3)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;

insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)
values ('FK1mBtGsCw9iAYQjgz5A','Фруктові','fruktovi','',true,false,1)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;

insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)
values ('OwSuwBgkLuLTmseHHnyG','Джин','dzhyn','',false,false,1)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;

insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)
values ('Oik6v4sgqPytwvq9YYft','Незвичні','nezvychni','',true,false,4)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;

insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)
values ('WxtCHyNHcnIhkMCUExFR','Пюре','purees','Густі пюре з фруктів для смузі та десертів',false,false,4)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;

insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)
values ('XYbSOSZU8nMT4cr9aGtw','Сухоцвіти','dried-flowers','Сушені квіти та трави для декоративного прикраси страв',true,true,5)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;

insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)
values ('ZjTAiW8a3B6jUZUx8fnw','Ягідний ','iagidnyi','',true,false,2)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;

insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)
values ('bd2vaN5rDov3wdoETukM','Spicer','spicer','український бренд міцного алкоголю зі смаками та сенсами',true,true,5)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;

insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)
values ('cCEraaisG27c0MAjNfbh','Гіпсофіла','gipsofila','',true,false,0)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;

insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)
values ('f6UOJMmTYpZ1k0rERfaH','Горіховий','gorikhovyi','',true,false,3)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;

insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)
values ('syropy','Сиропи','syropy','Широкий асортимент натуральних сиропів для напоїв та десертів',true,true,0)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;

insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)
values ('tfjBtdoOKCD0RcIPwhcy','Для коктейлів','dlia-kokteiliv','',true,false,0)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;

insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)
values ('u1apzvSBmbdke4zH1ori','Гортензія','gortenziia','',true,false,4)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;

insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)
values ('uK6dK1gYgPWxyNaOcRpn','Лагурус','lagurus','',true,false,10)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;

insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)
values ('wOcP6pWl4q4v21MC9qJl','Органічні замінники ','organichni-zaminnyky','',true,false,0)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;

insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)
values ('generated:syrups','syrups','syrups','',true,false,999)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,
  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('00b33a6f-8410-4ac2-b0dc-1fbf654dfbcb',(select id from public.categories where slug = 'syropy'),'Сироп "Жасмин"','syrup-жасмин','Сироп "Жасмин" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор жасмин','Барвник: Е133']::text[],0,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('01a4ec9a-8a0e-489b-a1b6-3e7c4a43259b',(select id from public.categories where slug = 'syropy'),'Сироп "Троянда"','syrup-троянда','Сироп "Троянда" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор троянда','Барвник: Е133']::text[],1,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('02230dc8-a6e5-46b8-a0d3-1deabcf14a15',(select id from public.categories where slug = 'syropy'),'Сироп "Чай чорний"','syrup-чай-чорний','Сироп "Чай чорний" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор чай чорний','Барвник: Е133']::text[],2,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('062eb409-03d4-428d-a7d9-534345716990',(select id from public.categories where slug = 'syropy'),'Сироп "Манго пряний"','syrup-манго-пряний','Сироп "Манго пряний" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор манго пряний','Барвник: Е133']::text[],3,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('06f442cd-3725-4c93-9a2d-3055ba7663a1',(select id from public.categories where slug = 'syropy'),'Сироп "Макадамський горіх"','syrup-макадамський-горіх','Сироп "Макадамський горіх" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор макадамський горіх','Барвник: Е133']::text[],4,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('0bbac6f7-d09f-4183-8a53-258bbcd84916',(select id from public.categories where slug = 'syropy'),'Сироп "Яблучний пиріг"','syrup-яблучний-пиріг','Сироп "Яблучний пиріг" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор яблучний пиріг','Барвник: Е133']::text[],5,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('0c2eed01-a684-4d0f-b14d-b632aa64c3f4',(select id from public.categories where slug = 'syropy'),'Сироп "Фіалка"','syrup-фіалка','Сироп "Фіалка" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор фіалка','Барвник: Е133']::text[],6,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('0fv7CpFoiDUx8DlT3b2W',(select id from public.categories where slug = 'chips'),'Грушеві чипси (смужки)','product-0fv7cpfoidux8dlt3b2w','Ніжна солодкість осіннього саду в кожному слайсі. Наші грушеві чипси виготовлені з соковитих груш, чия природна солодкість та легкий квітковий аромат ідеально збережені завдяки делікатній дегідрації. Кожен слайс має приємну крихку текстуру та природний золотистий відтінок.

Для професіоналів (Барна культура): вишуканий гарніш для елегантних коктейлів. Ідеально поєднується з бренді, кальвадосом, витриманим ромом та ігристими винами. Підкреслить благородство віскі в класичних міксах та додасть нотку витонченості горілчаним чи джиновим коктейлям з квітковими лікерами.

Для домашнього вжитку (Гастрономія): класичне доповнення до сирної тарілки, особливо до сирів з блакитною пліснявою, брі або камамберу. Використовуйте як корисний та смачний снек або додавайте в салати з руколою та горіхами для створення ресторанної страви вдома.

Ключові аспекти: делікатний солодкий смак з квітковими нотами, елегантний золотистий вигляд та універсальність застосування — від вишуканих напоїв до гастрономічних поєднань.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',335,null,true,true,true,false,'100г',array['Груша','глюкозний сироп']::text[],7,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('0gusWB8DKrlZyNmSaOJJ',(select id from public.categories where slug = 'decorations'),'Коктейльний цукор Червоний','product-0guswb8dkrlzynmsaojj','Спеціалізована цукрова суміш для професійного оформлення обідка келиха (rimming). Цей продукт вирізняється стандартизованою фракцією (розміром кристалів), що забезпечує ідеальне прилипання та рівномірне покриття. Доступний у різних кольорах.



Цукор створює акуратний, візуально привабливий обідок для класичних та авторських коктейлів (Margarita, Cosmopolitan, Lemon Drop). Спеціальна текстура запобігає надмірному розсипанню та полегшує процес декорування.

Різні кольори цукру можуть слугувати для маркування напоїв або дотримання фірмового стилю закладу. Яскравий колір миттєво привертає увагу.



Ключові аспекти: стандартизована фракція для rimming, швидкість та легкість застосування, візуальний та смаковий контраст, підвищення якості презентації.',85,null,true,true,true,false,'70г','{}'::text[],8,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('0t5hhaS4zOyv9do5JV7q',(select id from public.categories where slug = 'decorations'),'Скелетоване листя Мікс','product-0t5hhas4zoyv9do5jv7q','Елегантна витонченість та текстурна прозорість для преміального декору. Скелетоване листя- це делікатний матеріал, що пройшов спеціалізовану обробку для видалення м''якої тканини, залишаючи лише тонку мереживну сітку жилок. Вони забезпечують легкий, повітряний та вишуканий візуальний ефект.

Скелетоване листя є високохудожнім, невагомим елементом декору, що ідеально підходить для елітних подач. Листя забезпечує вишуканий, мереживний ефект у прозорих напоях. Його напівпрозора структура не закриває колір напою, а додає глибини та текстури.
Листя може використовуватися для створення колірного контрасту (наприклад, позолочене або срібне листя на темних напоях), підвищуючи драматизм подачі.
Ідеальний матеріал для включення у кубики льоду. Завдяки своїй делікатній структурі, листя створює витончену, "заморожену" композицію, що повільно тане, не вивільняючи кольору чи сильного смаку.
Ідеальний елемент для прикраси мусових тортів, желе, макаронів та цукерок. Листя може бути зафіксоване під прозорою глазур''ю або на шоколадних виробах, створюючи ефектний, крихкий вигляд.

Ключові аспекти: унікальна мереживна текстура, прозорий, повітряний вигляд, висока декоративна цінність для тонких робіт. Це делікатне, високоякісне та естетично впливове рішення для преміального, візуально орієнтованого бартендингу.',265,null,true,true,true,false,'50шт','{}'::text[],9,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('149ef1c7-d219-4484-9869-fbfb470f1e88',(select id from public.categories where slug = 'syropy'),'Сироп "Лемонграс"','syrup-лемонграс','Сироп "Лемонграс" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор лемонграс','Барвник: Е133']::text[],10,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('1d228fce-cc2c-404a-ac86-d25bf8952e20',(select id from public.categories where slug = 'syropy'),'Сироп "Халва"','syrup-халва','Сироп "Халва" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор халва','Барвник: Е133']::text[],11,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('1d7f18f4-569a-4f95-8b93-02573d8852b0',(select id from public.categories where slug = 'syropy'),'Сироп "Блю Курасао"','syrup-блю-курасао','Сироп "Блю Курасао" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор блю курасао','Барвник: Е133']::text[],12,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('20a43e9c-6f40-46c5-a5e3-7ef0b0042b34',(select id from public.categories where slug = 'syropy'),'Сироп "Кокос"','syrup-кокос','Сироп "Кокос" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор кокос','Барвник: Е133']::text[],13,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('2643HQjme92QHFnaHBLz',(select id from public.categories where slug = 'chips'),'Томатні чипси ','product-2643hqjme92qhfnahblz','Функціональний декор та концентрований смак для сучасної гастрономії. Наші томатні чипси — це ідеально висушені слайси добірних помідорів. Завдяки приправі з морської солі вони набувають інтенсивного аромату та глибокого смаку, забезпечуючи апетитну хрустку текстуру.

Для професіоналів (Барна культура): логічний та стильний гарніш для Bloody Mary, Red Snapper та інших овочевих і savory-коктейлів. Чудово поєднується з джином, горілкою та трав''яними лікерами. Може слугувати елегантною закускою-компліментом, що розпалює апетит.

Для домашнього вжитку (Гастрономія): хрусткої текстури та концентрованого томатного смаку брускетам, салатам, пасті та крем-супам. Це також чудова самостійна закуска, що ідеально смакує з келихом вина чи пива.

Ключові аспекти: насичений смак стиглого томата, апетитна хрустка текстура, простий та зрозумілий склад. Універсальний продукт для кухні та бару.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',350,null,true,true,true,false,'100г',array['Томат','морська сіль']::text[],14,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('284073d5-77ee-4f71-b8ed-84fe930d6ecd',(select id from public.categories where slug = 'syropy'),'Сироп "Мохіто ментол"','syrup-мохіто-ментол','Сироп "Мохіто ментол" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор мохіто ментол','Барвник: Е133']::text[],15,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('2YmCorDNaYBwBXw6exRi',(select id from public.categories where slug = 'decorations'),'Цукрові кульки Блакитні','product-2ymcordnaybwbxw6exri','Універсальний, глянцевий декоративний елемент для створення візуального об''єму та святкового блиску. Ці рівномірно сформовані, тверді кристали забезпечують чистий колір та інтенсивне відбивання світла.
Розміри кульок 5-7мм.

Можуть використовуватися для обтяження або стабілізації легких елементів (наприклад, сухоцвітів) при їхньому кріпленні до основи гарнішу або для включення у кубики льоду як декоративний елемент. Їх тверда текстура мінімізує швидке розмокання від вологи келиха, що є ідеальним для десертних коктейлів та морозних напоїв.
Гладка, глянцева поверхня кульок забезпечує високий блиск, що миттєво підвищує святковість та естетичну привабливість готового виробу чи напою.

Ключові аспекти: стійка, тверда форма, інтенсивний блиск, візуальний об''єм, універсальність для створення святкового декору.',50,null,true,true,true,false,'100г','{}'::text[],16,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('2a8f914a-e287-4638-a4c6-a2d16efdfbc3',(select id from public.categories where slug = 'syropy'),'Сироп "Лимон"','syrup-лимон','Сироп "Лимон" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор лимон','Барвник: Е133']::text[],17,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('2gKrXyRTQsNJYR9QAjAC',(select id from public.categories where slug = 'decorations'),'Харчовий шимер Білий','product-2gkrxyrtqsnjyr9qajac','Дрібнодисперсний, високоактивний пігмент для створення динамічного, глибокого мерехтіння всередині рідини. Це професійний засіб забезпечує інтенсивну іризацію та рівномірний перелив кольору, перетворюючи прозорі напої на видовищні композиції.



Доступний у широкій палітрі (золото, срібло, рожевий, синій), що дозволяє миттєво задати тон коктейлю та підкреслити смакові ноти візуальним рядом.



При додаванні до прозорих алкогольних чи безалкогольних напоїв та легкому збовтуванні шимер створює магнетичний ефект "зіркового пилу" або рухомого туману.

Ефект дзеркального переливу максимально відображається на фото та відео, роблячи напій винятково привабливим для соціальних мереж та маркетингу.



Ключові аспекти: глибоке, динамічне мерехтіння, легке суспендування у рідинах, висока концентрація, миттєва трансформація візуальної подачі.',225,null,true,true,true,false,'10г','{}'::text[],18,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('346d308e-1286-467e-b6b0-59461259f5de',(select id from public.categories where slug = 'syropy'),'Сироп "Попкорн"','syrup-попкорн','Сироп "Попкорн" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор попкорн','Барвник: Е133']::text[],19,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('3fSuvv6dLboaXv3OM7lN',(select id from public.categories where slug = 'dried-flowers'),'Колоски декоративні Лагурус Фіолетові','product-3fsuvv6dlboaxv3om7ln','Натуральна естетика та структурний акцент у декоративному оформленні. Ці добірні, висушені стебла (колоски) зі збереженою природною формою є стабільним, екологічним елементом для створення автентичних композицій.



У барній культурі можуть використовуватися для оригінального декору та надання напоям сезонного, теплого вайбу. Ідеально підходять для фотогенічних подач, простий засіб для додавання затишного, природного акценту.



Ключові аспекти: автентичний вигляд, стабільна суха структура, універсальність для створення тематичних композицій.',200,null,true,true,true,false,'50шт','{}'::text[],20,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('3pDkA6i8ftIgo1T58wjv',(select id from public.categories where slug = 'decorations'),'Блискітки харчові Золото','product-3pdka6i8ftigo1t58wjv','Декоративний елемент для створення інтенсивного, видимого мерехтіння. Ці харчові частинки вирізняються високою здатністю до світловідбивання, забезпечуючи феєричний та святковий візуальний ефект на будь-якій поверхні.

Це інноваційний інструмент для створення живого, рухомого блиску у напоях. Додавання мінімальної кількості у прозорі або напівпрозорі коктейлі (наприклад, з джином, горілкою, лікерами) створює магнетичний, іскристий вихор, який рухається при обертанні келиха. Це ідеально підходить для тематичних, футуристичних або святкових подач.
Використовуються для створення іскристого обідка (rimming)- їх можна змішувати з цукровою пудрою або сіллю для текстурного, блискучого контрасту з кольором напою.
Блискітки є гарантією високої уваги в соціальних мережах, оскільки вони максимально відбивають світло на фото та відео.
Ідеально підходить для сухого нанесення на глазурі, кремові шапки та шоколадні вироби. Блискітки додають текстурного та іскристого фінішу тортам, макаронам та капкейкам. Можуть бути додані у тісто або прозорі желе/муси перед застиганням, забезпечуючи рівномірне розподілення блиску по всьому об’єму продукту.

Ключові аспекти: динамічний, мерехтливий ефект, висока інтенсивність блиску, видимий розмір частинок, абсолютна харчова безпека, універсальність для сухого та рідкого декору.',100,null,true,true,true,false,'3г','{}'::text[],21,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('45b86fa0-f9f8-44de-83e7-c0a89bb557a4',(select id from public.categories where slug = 'syropy'),'Сироп "Чорниця"','syrup-чорниця','Сироп "Чорниця" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор чорниця','Барвник: Е133']::text[],22,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('478353c1-bc83-459a-9991-bbfba11ab5d7',(select id from public.categories where slug = 'syropy'),'Сироп "Банан зелений"','syrup-банан-зелений','Сироп "Банан зелений" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор банан зелений','Барвник: Е133']::text[],23,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('49085abf-2c20-49f6-b597-63fb9a03932e',(select id from public.categories where slug = 'syropy'),'Сироп "Диня жовта"','syrup-диня-жовта','Сироп "Диня жовта" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор диня жовта','Барвник: Е133']::text[],24,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('4RmnxldvHx2K2D2k2H5N',(select id from public.categories where slug = 'chips'),'Бурякові чипси (цілісні) ','product-4rmnxldvhx2k2d2k2h5n','Багатогранний смак та насичений рубіновий колір у кожному слайсі. Природна солодкість добірного буряка тут елегантно підкреслена морською сіллю. Дегідрація до ідеального хрусту концентрує ці смаки, створюючи багатогранний та незабутній снек.

Для Професіоналів (Барна культура): ідеальний гарніш для авторських та гастрономічних коктейлів. Його пряно-солоний профіль стане знахідкою для варіацій на Bloody Mary, Michelada або для коктейлів на основі джину з трав''яними нотами. Також може подаватися як самостійний комплімент до напоїв.

Для домашнього вжитку (Гастрономія): повноцінна гурме-закуска, що смакує як сама по собі, так і в поєднанні з різними діпами. Додайте пікантності та хрусту салатам, крем-супам або використовуйте як оригінальний елемент на сирній чи м''ясній тарілці.

Ключові аспекти: складний, багатошаровий смак — солодкий та солоний одночасно. Фантастичний рубіновий колір та апетитна хрустка текстура. Це готове рішення для гурманів.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',310,null,true,true,true,true,'100г',array['Буряк','морська сіль']::text[],25,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('4ce8aa3b-9457-4aad-9494-6b197861f531',(select id from public.categories where slug = 'syropy'),'Сироп "Вишня"','syrup-вишня','Сироп "Вишня" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор вишня','Барвник: Е133']::text[],26,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('4e1efa21-7313-4abe-bf14-4d2bd5c6512b',(select id from public.categories where slug = 'syropy'),'Сироп "Ожина"','syrup-ожина','Сироп "Ожина" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор ожина','Барвник: Е133']::text[],27,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('506405e1-6cb7-4b16-a4af-2c8ad3037551',(select id from public.categories where slug = 'syropy'),'Сироп "Кактус"','syrup-кактус','Сироп "Кактус" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор кактус','Барвник: Е133']::text[],28,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('5123792f-b39e-4925-b1e9-e800490c0c81',(select id from public.categories where slug = 'syropy'),'Сироп "Персик"','syrup-персик','Сироп "Персик" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор персик','Барвник: Е133']::text[],29,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('5b1a678c-19e7-4d88-aff0-14a4b11de18f',(select id from public.categories where slug = 'syropy'),'Сироп "Гранат"','syrup-гранат','Сироп "Гранат" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор гранат','Барвник: Е133']::text[],30,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('5d86607c-138e-4453-acde-603b481a4a5c',(select id from public.categories where slug = 'syropy'),'Сироп "Ананас"','syrup-ананас','Сироп "Ананас" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор ананас','Барвник: Е133']::text[],31,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('5f899212-0cf0-45cd-b880-353370d78cb4',(select id from public.categories where slug = 'syropy'),'Сироп "Барбарис"','syrup-барбарис','Сироп "Барбарис" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор барбарис','Барвник: Е133']::text[],32,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('5nGslmpsqpghRiG0nQWh',(select id from public.categories where slug = 'chips'),'Грейпфрутові чипси (півкільця)','product-5ngslmpsqpghrig0nqwh','Практична елегантність для бездоганної подачі. Ці чипси з рожевого грейпфрута поєднують в собі вишуканий смак та продуману форму півкільця. Кожен слайс — це ідеальний баланс цитрусової гірчинки та легкої солодкості, а його форма створена для максимальної зручності у декоруванні.

Для професіоналів (Барна культура): універсальний гарніш для швидкої та стильної подачі. Ідеальна прикраса на край будь-який келих, що робить його незамінним для бартендерів, які цінують швидкість та естетику. Чудово доповнює Paloma, French 75 та інші коктейлі на основі ігристого.

Для домашнього вжитку (Гастрономія): найпростіший спосіб надати вашим напоям професійного вигляду. Просто покладіть півкільце на край келиха з лимонадом, тоніком чи улюбленим коктейлем, щоб миттєво його прикрасити. Також ефектно виглядає як декор для десертів.

Ключові аспекти: витончений гіркувато-солодкий смак, ніжно-кораловий колір та функціональна форма, що гарантує легке та швидке декорування.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',280,null,true,true,true,false,'100г',array['Грейпфрут','глюкозний сироп','сіль']::text[],33,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('5tmchb3EYnVAcwgctd1K',(select id from public.categories where slug = 'decorations'),'Кандурин Античне золото','product-5tmchb3eynvacwgctd1k','Високоякісний перламутровий пігмент для створення глибокого, насиченого металевого фінішу. Цей дрібнодисперсний барвник забезпечує вишуканий відтінок старого золота з винятковою відбивною здатністю, ідеальний для надання виробам розкішного, вінтажного вигляду.

При додаванні у прозорі коктейлі створює магнетичний ефект "золотого вихору" (shimmer), що надає напою динамічного блиску та преміальної візуальної глибини.
Ідеальний для надання металевого відтінку цитрусовим слайсам, сухоцвітам або їстівним прикрасам (як-от Ізомальт), створюючи елітний, цілісний дизайн подачі.

Незамінний інструмент для фарбування шоколаду, мастики, айсингу та цукрових фігур. Використовується для сухого нанесення (для матового блиску) або змішування з алкоголем (для ефекту рідкого металу).
Пігмент добре фіксується на поверхнях і стабільно суспендується у рідинах, зберігаючи яскравість кольору без помутніння.

Ключові аспекти: глибокий відтінок "Античне золото", дрібнодисперсна структура, універсальність (сухе/рідке фарбування), висока естетична цінність.',300,null,true,true,true,false,'10г','{}'::text[],34,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('603dafd0-1d9e-49c6-9d01-828ec3d61768',(select id from public.categories where slug = 'syropy'),'Сироп "Барбарис (Спайсі)"','syrup-барбарис-спайсі','Сироп "Барбарис (Спайсі)" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор барбарис (спайсі)','Барвник: Е133']::text[],35,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('6da3bd5a-8d84-4254-a27b-0fc5e46ebd74',(select id from public.categories where slug = 'syropy'),'Сироп "Піна Колада"','syrup-піна-колада','Сироп "Піна Колада" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор піна колада','Барвник: Е133']::text[],36,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('74b08fff-8e3b-45af-a318-f6bad10cda07',(select id from public.categories where slug = 'syropy'),'Сироп "Чилі (пряний)"','syrup-чилі-пряний','Сироп "Чилі (пряний)" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор чилі (пряний)','Барвник: Е133']::text[],37,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('75449dde-5ee1-414b-bfee-5995e6609b09',(select id from public.categories where slug = 'syropy'),'Сироп "Ізабелла (виноград)"','syrup-ізабелла-виноград','Сироп "Ізабелла (виноград)" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор ізабелла (виноград)','Барвник: Е133']::text[],38,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('758473d4-9e59-41b3-a684-5dc29fdad8cc',(select id from public.categories where slug = 'syropy'),'Сироп "Тірамісу"','syrup-тірамісу','Сироп "Тірамісу" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор тірамісу','Барвник: Е133']::text[],39,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('78092947-372d-4a0e-b5be-94b35c86fc14',(select id from public.categories where slug = 'syropy'),'Сироп "Мандарин"','syrup-мандарин','Сироп "Мандарин" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор мандарин','Барвник: Е133']::text[],40,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('79e3b4e5-e571-4143-b352-badf657936ee',(select id from public.categories where slug = 'syropy'),'Сироп "Груша"','syrup-груша','Сироп "Груша" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор груша','Барвник: Е133']::text[],41,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('7a4ce2dd-82d1-422d-a208-ac1679cdc725',(select id from public.categories where slug = 'syropy'),'Сироп "Базилік"','syrup-базилік','Сироп "Базилік" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор базилік','Барвник: Е133']::text[],42,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('7b1ee33d-8bd2-4794-afb7-1b89ba31da77',(select id from public.categories where slug = 'syropy'),'Сироп "Диня зелена"','syrup-диня-зелена','Сироп "Диня зелена" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор диня зелена','Барвник: Е133']::text[],43,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('7eb3e4cd-9be6-41c3-925d-8132f30ef695',(select id from public.categories where slug = 'syropy'),'Сироп "Клен"','syrup-клен','Сироп "Клен" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор клен','Барвник: Е133']::text[],44,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('7f0997b6-43eb-4ce9-aab2-e7e4478bf756',(select id from public.categories where slug = 'syropy'),'Сироп "Біттер"','syrup-біттер','Сироп "Біттер" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор біттер','Барвник: Е133']::text[],45,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('84413ef1-4813-43aa-8633-7eb183fdf29e',(select id from public.categories where slug = 'syropy'),'Сироп "Манго"','syrup-манго','Сироп "Манго" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор манго','Барвник: Е133']::text[],46,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('85007583-39b3-4326-99c9-f2d75d6b67e8',(select id from public.categories where slug = 'syropy'),'Сироп "Полуниця"','syrup-полуниця','Сироп "Полуниця" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор полуниця','Барвник: Е133']::text[],47,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('8f1211e7-ad8e-4b6a-a686-9a430e1b4223',(select id from public.categories where slug = 'syropy'),'Сироп "Ківі"','syrup-ківі','Сироп "Ківі" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор ківі','Барвник: Е133']::text[],48,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('91992f71-81d0-4b3a-babc-def3b2b07ee2',(select id from public.categories where slug = 'syropy'),'Сироп "Гренадін"','syrup-гренадін','Сироп "Гренадін" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор гренадін','Барвник: Е133']::text[],49,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('938354e2-4f07-49d2-a9b2-e7171353e5be',(select id from public.categories where slug = 'syropy'),'Сироп "Фундук"','syrup-фундук','Сироп "Фундук" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор фундук','Барвник: Е133']::text[],50,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('943ebf4f-0df1-4383-af6d-7f172ba3716c',(select id from public.categories where slug = 'syropy'),'Сироп "Шоколад"','syrup-шоколад','Сироп "Шоколад" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор шоколад','Барвник: Е133']::text[],51,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('95531524-6f4f-4459-8bd1-d290e8b39da1',(select id from public.categories where slug = 'syropy'),'Сироп "Кавун"','syrup-кавун','Сироп "Кавун" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор кавун','Барвник: Е133']::text[],52,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('969b629f-2fc9-46c2-a5d9-3dc665c8a473',(select id from public.categories where slug = 'syropy'),'Сироп "Моджо"','syrup-моджо','Сироп "Моджо" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор моджо','Барвник: Е133']::text[],53,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('96b8ca41-1b3b-46dd-856c-e8ddcbb7af71',(select id from public.categories where slug = 'syropy'),'Сироп "Бабл Гам"','syrup-бабл-гам','Сироп "Бабл Гам" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор бабл гам','Барвник: Е133']::text[],54,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('983dfa88-d9f2-4e36-9cb4-e8b8b2f1b711',(select id from public.categories where slug = 'syropy'),'Сироп "Айва"','syrup-айва','Сироп "Айва" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор айва','Барвник: Е133']::text[],55,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('98785db6-ed28-47fc-9847-30d53df0b3b4',(select id from public.categories where slug = 'syropy'),'Сироп "Копчений"','syrup-копчений','Сироп "Копчений" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор копчений','Барвник: Е133']::text[],56,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('98eb1abc-c0d4-4260-b571-152942e7698a',(select id from public.categories where slug = 'syropy'),'Сироп "Апельсин"','syrup-апельсин','Сироп "Апельсин" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор апельсин','Барвник: Е133']::text[],57,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('98fbd25f-c4fc-48f9-b9f6-159f228f9c9a',(select id from public.categories where slug = 'syropy'),'Сироп "Бузина квітка"','syrup-бузина-квітка','Сироп "Бузина квітка" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор бузина квітка','Барвник: Е133']::text[],58,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('995388b2-ec67-4747-acb1-c5e26b26862a',(select id from public.categories where slug = 'syropy'),'Сироп "Маракуйя"','syrup-маракуйя','Сироп "Маракуйя" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор маракуйя','Барвник: Е133']::text[],59,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('999bc157-69e2-4441-85aa-297d8bf52093',(select id from public.categories where slug = 'syropy'),'Сироп "Мигдаль"','syrup-мигдаль','Сироп "Мигдаль" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор мигдаль','Барвник: Е133']::text[],60,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('9VGHSAo5gMMBtbDpDlgh',(select id from public.categories where slug = 'dried-flowers'),'Колоски декоративні Лагурус Блакитні','product-9vghsao5gmmbtbdpdlgh','Натуральна естетика та структурний акцент у декоративному оформленні. Ці добірні, висушені стебла (колоски) зі збереженою природною формою є стабільним, екологічним елементом для створення автентичних композицій.

У барній культурі можуть використовуватися для оригінального декору та надання напоям сезонного, теплого вайбу. Ідеально підходять для фотогенічних подач, простий засіб для додавання затишного, природного акценту.

Ключові аспекти: автентичний вигляд, стабільна суха структура, універсальність для створення тематичних композицій.',200,null,true,true,true,false,'50шт','{}'::text[],61,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('9a6abfbb-37db-4aea-84d0-4678c3079a5e',(select id from public.categories where slug = 'syropy'),'Сироп "Амаретто"','syrup-амаретто','Сироп "Амаретто" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор амаретто','Барвник: Е133']::text[],62,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('9b8e47a5-6b64-44fa-b057-5fd3b251ed34',(select id from public.categories where slug = 'syropy'),'Сироп "Імбир"','syrup-імбир','Сироп "Імбир" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор імбир','Барвник: Е133']::text[],63,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('9db1f45b-2c92-486d-8d74-52d9309c6915',(select id from public.categories where slug = 'syropy'),'Сироп "Апероль"','syrup-апероль','Сироп "Апероль" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор апероль','Барвник: Е133']::text[],64,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('9f2290eb-29f8-441e-86ee-12d3f4ee0e04',(select id from public.categories where slug = 'syropy'),'Сироп "Яблуко зелене"','syrup-яблуко-зелене','Сироп "Яблуко зелене" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор яблуко зелене','Барвник: Е133']::text[],65,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('9fa7ab27-7285-48af-9ce0-80672404f1b0',(select id from public.categories where slug = 'syropy'),'Сироп "Ехінацея"','syrup-ехінацея','Сироп "Ехінацея" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор ехінацея','Барвник: Е133']::text[],66,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('9wkpoZZ5JRDR6gElCeCI',(select id from public.categories where slug = 'dlia-kokteiliv'),'Superjuice ','product-9wkpozz5jrdr6gelceci','Забудьте про нестабільну якість лимонів та постійні списання. Наш Суперджус — це революційне рішення для бару, що поєднує натуральність, стабільність та економію. Це повністю органічний продукт, створений для оптимізації роботи бармена без компромісів у якості напоїв.
Чому варто обрати наш Суперджус:
• Абсолютна стабільність: Завжди однаковий рівень pH (кислотності), смак та аромат. Це гарантує, що ваші коктейлі будуть смакувати ідеально, незалежно від партії фруктів.
• Економія часу та грошей: Значно знижує витрати на закупівлю інгредієнтів (вищий вихід продукту порівняно з фрешем) та економить дорогоцінний час персоналу на підготовку.
• Тривале зберігання: Термін придатності становить близько 2 тижнів, що мінімізує списання порівняно зі звичайним фрешем, який "вмирає" за добу.
• 100% Organic: Жодної "хімії". У складі відсутні консерванти, барвники чи штучні ароматизатори. Тільки чистий, натуральний смак.
Результат: Ваші коктейлі завжди збалансовані, а фудкост — під контролем.',180,null,false,true,true,true,'1л',array['Лимон','органічна лимонна кислота']::text[],67,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('A0gklnZKUE9bHN6IEb5u',(select id from public.categories where slug = 'dried-flowers'),'Колоски декоративні Лагурус Бузкові','product-a0gklnzkue9bhn6ieb5u','Натуральна естетика та структурний акцент у декоративному оформленні. Ці добірні, висушені стебла (колоски) зі збереженою природною формою є стабільним, екологічним елементом для створення автентичних композицій.



У барній культурі можуть використовуватися для оригінального декору та надання напоям сезонного, теплого вайбу. Ідеально підходять для фотогенічних подач, простий засіб для додавання затишного, природного акценту.



Ключові аспекти: автентичний вигляд, стабільна суха структура, універсальність для створення тематичних композицій.',200,null,true,true,true,false,'50шт','{}'::text[],68,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('AkgQnuOriO54gRfb3rJT',(select id from public.categories where slug = 'decorations'),'Соломинка з очерету 19-20см','product-akgqnuorio54grfb3rjt','Соломинка з очерету- екологічна альтернатива🌿
Натуральний, біорозкладний очерет забезпечує унікальну текстуру та природний вигляд. Це функціональне та стійке рішення для закладів, що дотримуються концепції екологічно чистого споживання.
Виготовлені з екологічно чистої сировини, яка пройшла термічну і гігієнічну обробку.
Витримує температуру понад 120 градусів.
Не виділяє целюлозні волокна в напій.
Зберігати в сухому темному місці.

Природний, мінімалістичний дизайн чудово поєднується з тропічними, трав''яними та авторськими коктейлями (наприклад, Tiki, Mojito), підкреслюючи натуральність інгредієнтів.
Соломинки з очерету є ідеальним, повністю компостованим замінником пластикових виробів, що відповідає сучасним екологічним стандартам.
Очерет не впливає на смак напою, забезпечуючи чистий споживацький досвід (на відміну від деяких видів паперових чи бамбукових соломинок).

Ключові аспекти: екологічна чистота, натуральний вигляд, смакова нейтральність, функціональність для стійкого сервісу.',240,null,true,true,true,false,'100шт',array['100% очерет']::text[],69,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('BTxUrFm6c3ZDgv9IpBjt',(select id from public.categories where slug = 'decorations'),'Харчовий шимер Фіолетовий','product-btxurfm6c3zdgv9ipbjt','Дрібнодисперсний, високоактивний пігмент для створення динамічного, глибокого мерехтіння всередині рідини. Це професійний засіб забезпечує інтенсивну іризацію та рівномірний перелив кольору, перетворюючи прозорі напої на видовищні композиції.



Доступний у широкій палітрі (золото, срібло, рожевий, синій), що дозволяє миттєво задати тон коктейлю та підкреслити смакові ноти візуальним рядом.



При додаванні до прозорих алкогольних чи безалкогольних напоїв та легкому збовтуванні шимер створює магнетичний ефект "зіркового пилу" або рухомого туману.

Ефект дзеркального переливу максимально відображається на фото та відео, роблячи напій винятково привабливим для соціальних мереж та маркетингу.



Ключові аспекти: глибоке, динамічне мерехтіння, легке суспендування у рідинах, висока концентрація, миттєва трансформація візуальної подачі.',225,null,true,true,true,false,'10г','{}'::text[],70,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('C21fnHAAQqXLeo5LZtP9',(select id from public.categories where slug = 'chips'),'Чорні Лаймові чипси ','product-c21fnhaaqqxleo5lztp9','Наші чорні лаймові чіпси — це смілива заява для тих, хто цінує стиль та не боїться експериментів. Класична кислинка свіжого лайма в цьому продукті поєднується з глибоким, таємничим чорним кольором. Кожен слайс — це витвір мистецтва, що інтригує та привертає погляди, народжуючи абсолютно нову естетику.

Для професіоналів (Барна культура): створюйте неймовірний візуальний контраст у світлих коктейлях, як-от Daiquiri або Gin & Tonic, або додайте нотку таємничості темним напоям. Це ідеальний інструмент для створення мінімалістичних, авангардних та фотогенічних подач.

Для домашнього вжитку (Гастрономія): гарантований спосіб вразити гостей. Навіть найпростіший напій перетвориться на дизайнерський коктейль з таким декором.

Ключові аспекти: унікальний та драматичний чорний колір, збережений інтенсивний смак лайма, неперевершений візуальний ефект. Це не просто гарніш, а потужний інструмент для створення настрою.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',395,null,true,true,true,false,'100г',array['Лайм','глюкозний сироп','сіль']::text[],71,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('DZld8o4JTLjsleyiL8C9',(select id from public.categories where slug = 'dried-flowers'),'Колоски декоративні Лагурус Чорні','product-dzld8o4jtljsleyil8c9','Натуральна естетика та структурний акцент у декоративному оформленні. Ці добірні, висушені стебла (колоски) зі збереженою природною формою є стабільним, екологічним елементом для створення автентичних композицій.



У барній культурі можуть використовуватися для оригінального декору та надання напоям сезонного, теплого вайбу. Ідеально підходять для фотогенічних подач, простий засіб для додавання затишного, природного акценту.



Ключові аспекти: автентичний вигляд, стабільна суха структура, універсальність для створення тематичних композицій.',200,null,true,true,true,false,'50шт','{}'::text[],72,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('EXsx6QvMbYbVFlSsV8iz',(select id from public.categories where slug = 'decorations'),'Блискітки харчові Срібло','product-exsx6qvmbybvflssv8iz','Декоративний елемент для створення інтенсивного, видимого мерехтіння. Ці харчові частинки вирізняються високою здатністю до світловідбивання, забезпечуючи феєричний та святковий візуальний ефект на будь-якій поверхні.

Це інноваційний інструмент для створення живого, рухомого блиску у напоях. Додавання мінімальної кількості у прозорі або напівпрозорі коктейлі (наприклад, з джином, горілкою, лікерами) створює магнетичний, іскристий вихор, який рухається при обертанні келиха. Це ідеально підходить для тематичних, футуристичних або святкових подач.
Використовуються для створення іскристого обідка (rimming)- їх можна змішувати з цукровою пудрою або сіллю для текстурного, блискучого контрасту з кольором напою.
Блискітки є гарантією високої уваги в соціальних мережах, оскільки вони максимально відбивають світло на фото та відео.
Ідеально підходить для сухого нанесення на глазурі, кремові шапки та шоколадні вироби. Блискітки додають текстурного та іскристого фінішу тортам, макаронам та капкейкам. Можуть бути додані у тісто або прозорі желе/муси перед застиганням, забезпечуючи рівномірне розподілення блиску по всьому об’єму продукту.

Ключові аспекти: динамічний, мерехтливий ефект, висока інтенсивність блиску, видимий розмір частинок, абсолютна харчова безпека, універсальність для сухого та рідкого декору.',100,null,true,true,true,false,'3г','{}'::text[],73,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('FFfZ2BkdyI4OkROHLgPQ',(select id from public.categories where slug = 'dried-flowers'),'Гвоздика сушена','product-fffz2bkdyi4okrohlgpq','Концентрована пряність та зігріваючий аромат у кожному бутоні. Ключовий інгредієнт для створення зимових класичних смаків. Сушена гвоздика- це прянощі з характерною формою бутона, що має стійкий, інтенсивний аромат.

Незамінний компонент для створення зимових та святкових напоїв (глінтвейнів, пуншів, гарячих сидрів). Ключовий елемент для інфузії сиропів, біттерів та настоянок, де потрібен глибокий, стійкий пряний фон. Використовуйте цілі бутони для контрольованої ароматизації та збереження прозорості напою.
Довговічна пряність, що є основою для консервації, маринування та святкової випічки. Бутони можна додавати до яблук та цитрусових для створення натуральних, ароматних прикрас до свята.

Ключові аспекти: стійкий аромат, зігріваюча дія, тривалий термін зберігання зі збереженням властивостей. Це обов''язковий інгредієнт для сезонної кухні та бару.',160,null,true,true,true,false,'50г','{}'::text[],74,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('FODviQgA5fjhbBNxYi68',(select id from public.categories where slug = 'decorations'),'Барвник харчовий перламутровий Металік','product-fodviqga5fjhbbnxyi68','Висококонцентрований пігмент для створення дзеркального блиску та металізованого ефекту. Цей преміальний декоративний засіб забезпечує інтенсивну іризацію та глибокий перелив кольору на будь-якій поверхні.

Додавання мінімальної кількості у прозорі коктейлі або шампанське створює ефект "зіркового пилу" або рухомого, мерехтливого туману, підвищуючи яскравий ефект напою.
Може використовуватися для створення тонкого, перламутрового обідка (rimming) на келихах, що додає вишуканості та візуального контрасту напою.
Ідеально підходить для введення у прозорі глазурі або желе, створюючи глибокий, мерехтливий ефект (ефект "космічного" блиску) без помутніння основи.
Ключовий інструмент для надання елітного вигляду шоколадним виробам, макаронам та мусовим тортам.

Ключові аспекти: інтенсивний перламутровий блиск, універсальність (сухе та вологе застосування), висока концентрація для економічного використання, преміальний естетичний фініш.',115,null,true,true,true,false,'2г','{}'::text[],75,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('GA47JHyvgXHeiInUJKu0',(select id from public.categories where slug = 'chips'),'Грушеві чипси (кружальця)','product-ga47jhyvgxheiinujku0','Практична елегантність та багатогранний смак для преміальної подачі. Наші чипси з груші сорту "Конференція" — це тонкі слайси добірних плодів, висушені до ідеальної хрусткості. Вони концентрують природну солодкість та медовий аромат, що робить їх універсальним елементом декору. Вони стануть вишуканою прикрасою вашого коктейлю, десерту чи кулінарної страви. 

Для професіоналів (Барна культура): надійний гарніш для напоїв на основі віскі, рому та бренді. Завдяки своїй тонкій та хрусткій текстурі вони ідеально підходять для створення елегантних композицій та додають напою теплого, пряного аромату без зміни балансу.

Для домашнього вжитку (Гастрономія): використовуйте як здоровий, хрусткий снек або вишукане доповнення до сирних тарілок. Вони додають витонченості йогуртам та будь-якій домашній випічці.

Ключові аспекти: насичений, але ніжний смак, стабільна хрустка форма, преміальний золотисто-бурштиновий вигляд. Готове рішення для швидкого та стильного оформлення.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',330,null,true,true,true,false,'100г',array['Груша "Конференція"','глюкозний сироп']::text[],76,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('GZpSBJHQn4hBKk03LX1i',(select id from public.categories where slug = 'chips'),'Лимонні чипси  ','product-gzpsbjhqn4hbkk03lx1i','Класика, що ніколи не виходить з моди. Функціональна досконалість та концентрований цитрусовий аромат у кожному слайсі. Наші лимонні чипси — це висушені слайси стиглого лимона, що пропонують інтенсивну кислинку та бадьорий аромат. 

Для професіоналів (Барна культура): незамінний робочий інструмент для бару. Ідеальний гарніш для величезного спектру коктейлів: від класичних сауерів (Whiskey Sour, Pisco Sour) до Tom Collins та безлічі інших. Чипс стабільно тримає форму та додає напою завершеності.

Для домашнього вжитку (Гастрономія): найпростіший спосіб зробити будь-який напій елегантним. Додайте слайс до гарячого чи холодного чаю, домашнього лимонаду або просто у склянку з водою. Це також чудова їстівна прикраса для лимонних тартів та чізкейків.

Ключові аспекти: ідеально збалансований смак, універсальність застосування, яскравий та сонячний вигляд. Це основа, яка має бути під рукою у кожного.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',285,null,true,true,true,false,'100г',array['Лимон','глюкозний сироп','сіль']::text[],77,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('HVSBpQWUAPgIpviX8aGs',(select id from public.categories where slug = 'dried-flowers'),'Колоски декоративні Лагурус Зелені','product-hvsbpqwuapgipvix8ags','Натуральна естетика та структурний акцент у декоративному оформленні. Ці добірні, висушені стебла (колоски) зі збереженою природною формою є стабільним, екологічним елементом для створення автентичних композицій.



У барній культурі можуть використовуватися для оригінального декору та надання напоям сезонного, теплого вайбу. Ідеально підходять для фотогенічних подач, простий засіб для додавання затишного, природного акценту.



Ключові аспекти: автентичний вигляд, стабільна суха структура, універсальність для створення тематичних композицій.',200,null,true,true,true,false,'50шт','{}'::text[],78,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('HapGhWl9S94VS8m78Le9',(select id from public.categories where slug = 'chips'),'Бананові чипси (смужки)','product-hapghwl9s94vs8m78le9','Насичена солодкість та тропічний аромат в хрусткому слайсі. Наші бананові чипси — це високоякісні слайси стиглого банана, що пройшли контрольовану дегідрацію. Це зберігає їхню поживну цінність та концентрує натуральний смак, ідеальний для використання в барі та кулінарії. процес не лише створює приємну текстуру, а й концентрує природну солодкість фрукта, розкриваючи в ньому нотки меду та карамелі.

Для професіоналів (Барна культура): незамінний атрибут для автентичної подачі тікі-коктейлів. Ідеально доповнює напої на основі рому, кокосові та ананасові мікси, такі як Banana Daiquiri або Piña Colada. Можна використовувати цілими для декору краю келиха або подрібнювати для створення оригінальної посипки.

Для домашнього вжитку (Гастрономія): енергетичний та корисний перекус для всієї родини. Додавайте їх до ранкових пластівців, мюслі, йогурту або використовуйте як натуральний підсолоджувач та хрусткий елемент у домашній випічці та десертах.

Ключові аспекти: насичений, солодкий смак, приємна хрустка текстура. Це одночасно і готовий до вживання снек, і стильний елемент декору.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',335,null,true,true,true,true,'100г',array['Банан','сік лимона']::text[],79,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('HwZa81ry3nkG5guzpQml',(select id from public.categories where slug = 'decorations'),'Коктейльний цукор Фіолетовий','product-hwza81ry3nkg5guzpqml','Спеціалізована цукрова суміш для професійного оформлення обідка келиха (rimming). Цей продукт вирізняється стандартизованою фракцією (розміром кристалів), що забезпечує ідеальне прилипання та рівномірне покриття. Доступний у різних кольорах.



Цукор створює акуратний, візуально привабливий обідок для класичних та авторських коктейлів (Margarita, Cosmopolitan, Lemon Drop). Спеціальна текстура запобігає надмірному розсипанню та полегшує процес декорування.

Різні кольори цукру можуть слугувати для маркування напоїв або дотримання фірмового стилю закладу. Яскравий колір миттєво привертає увагу.



Ключові аспекти: стандартизована фракція для rimming, швидкість та легкість застосування, візуальний та смаковий контраст, підвищення якості презентації.',85,null,true,true,true,false,'70г','{}'::text[],80,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('IPbJQLB7PR9PeDWFFzOH',(select id from public.categories where slug = 'dried-flowers'),'Колоски декоративні Лагурус Бордові','product-ipbjqlb7pr9pedwffzoh','Натуральна естетика та структурний акцент у декоративному оформленні. Ці добірні, висушені стебла (колоски) зі збереженою природною формою є стабільним, екологічним елементом для створення автентичних композицій.



У барній культурі можуть використовуватися для оригінального декору та надання напоям сезонного, теплого вайбу. Ідеально підходять для фотогенічних подач, простий засіб для додавання затишного, природного акценту.



Ключові аспекти: автентичний вигляд, стабільна суха структура, універсальність для створення тематичних композицій.',200,null,true,true,true,false,'50шт','{}'::text[],81,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('Jr87V5YZXfcmRlQhnrI0',(select id from public.categories where slug = 'dried-flowers'),'Колоски декоративні Червоні','product-jr87v5yzxfcmrlqhnri0','Натуральна естетика та структурний акцент у декоративному оформленні. Ці добірні, висушені стебла (колоски) зі збереженою природною формою є стабільним, екологічним елементом для створення автентичних композицій.



У барній культурі можуть використовуватися для оригінального декору та надання напоям сезонного, теплого вайбу. Ідеально підходять для фотогенічних подач, простий засіб для додавання затишного, природного акценту.



Ключові аспекти: автентичний вигляд, стабільна суха структура, універсальність для створення тематичних композицій.',200,null,true,true,true,false,'50шт','{}'::text[],82,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('KTeTh93F37HrjBBDoAki',(select id from public.categories where slug = 'decorations'),'Харчовий шимер Блакитний','product-kteth93f37hrjbbdoaki','Дрібнодисперсний, високоактивний пігмент для створення динамічного, глибокого мерехтіння всередині рідини. Це професійний засіб забезпечує інтенсивну іризацію та рівномірний перелив кольору, перетворюючи прозорі напої на видовищні композиції.

Доступний у широкій палітрі (золото, срібло, рожевий, синій), що дозволяє миттєво задати тон коктейлю та підкреслити смакові ноти візуальним рядом.

При додаванні до прозорих алкогольних чи безалкогольних напоїв та легкому збовтуванні шимер створює магнетичний ефект "зіркового пилу" або рухомого туману.
Ефект дзеркального переливу максимально відображається на фото та відео, роблячи напій винятково привабливим для соціальних мереж та маркетингу.

Ключові аспекти: глибоке, динамічне мерехтіння, легке суспендування у рідинах, висока концентрація, миттєва трансформація візуальної подачі.',225,null,true,true,true,false,'10г','{}'::text[],83,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('L20uILZoTK3r3mHPbJvw',(select id from public.categories where slug = 'dried-flowers'),'Гіпсофіла','product-l20uilzotk3r3mhpbjvw','стабілізована',110,null,true,true,true,true,'38-40шт','{}'::text[],84,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('L8QZGcpmB4YxyTKTHn2Y',(select id from public.categories where slug = 'chips'),'Грейпфрутові чипси ','product-l8qzgcpmb4yxytkthn2y','Надійна якість та ароматична інтенсивність у кожному слайсі. Наші грейпфрутові чипси — це ідеально збалансовані слайси рожевого грейпфрута. Дегідрація концентрує їхню фірмову гірчинку та свіжість, забезпечуючи стабільний, сухий цитрусовий гарніш з привабливим кораловим відтінком.

Для професіоналів (Барна культура): незамінний гарніш для Paloma, а також ідеальний компаньйон для коктейлів на основі джину, текіли та мескалю. Чипс не лише прикрашає, але й додає тонкий цитрусовий аромат, що збагачує смаковий профіль напою, не перебиваючи його.

Для домашнього вжитку (Гастрономія): миттєво перетворіть ваш домашній Джин-тонік або склянку мінеральної води на витвір мистецтва. Використовуйте для прикрашання білосніжних десертів, таких як пана-кота або чізкейк, створюючи ефектний смаковий та візуальний контраст.

Ключові аспекти: складний, багатогранний смак, вишуканий зовнішній вигляд з ніжно-рожевим відтінком, універсальність у поєднанні з преміальним алкоголем.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',275,null,true,true,true,false,'100г',array['Грейпфрут','глюкозний сироп','сіль']::text[],85,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('Lqu8kWToignBtCEW6rpI',(select id from public.categories where slug = 'decorations'),'Скелетоване листя Рожеві','product-lqu8kwtoignbtcew6rpi','Елегантна витонченість та текстурна прозорість для преміального декору. Скелетоване листя- це делікатний матеріал, що пройшов спеціалізовану обробку для видалення м''якої тканини, залишаючи лише тонку мереживну сітку жилок. Вони забезпечують легкий, повітряний та вишуканий візуальний ефект.



Скелетоване листя є високохудожнім, невагомим елементом декору, що ідеально підходить для елітних подач. Листя забезпечує вишуканий, мереживний ефект у прозорих напоях. Його напівпрозора структура не закриває колір напою, а додає глибини та текстури.

Листя може використовуватися для створення колірного контрасту (наприклад, позолочене або срібне листя на темних напоях), підвищуючи драматизм подачі.

Ідеальний матеріал для включення у кубики льоду. Завдяки своїй делікатній структурі, листя створює витончену, "заморожену" композицію, що повільно тане, не вивільняючи кольору чи сильного смаку.

Ідеальний елемент для прикраси мусових тортів, желе, макаронів та цукерок. Листя може бути зафіксоване під прозорою глазур''ю або на шоколадних виробах, створюючи ефектний, крихкий вигляд.



Ключові аспекти: унікальна мереживна текстура, прозорий, повітряний вигляд, висока декоративна цінність для тонких робіт. Це делікатне, високоякісне та естетично впливове рішення для преміального, візуально орієнтованого бартендингу.',265,null,true,true,true,false,'50шт','{}'::text[],86,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('MDtReL7aAANldGTt3rgY',(select id from public.categories where slug = 'decorations'),'Скелетоване листя Червоні','product-mdtrel7aaanldgtt3rgy','Елегантна витонченість та текстурна прозорість для преміального декору. Скелетоване листя- це делікатний матеріал, що пройшов спеціалізовану обробку для видалення м''якої тканини, залишаючи лише тонку мереживну сітку жилок. Вони забезпечують легкий, повітряний та вишуканий візуальний ефект.



Скелетоване листя є високохудожнім, невагомим елементом декору, що ідеально підходить для елітних подач. Листя забезпечує вишуканий, мереживний ефект у прозорих напоях. Його напівпрозора структура не закриває колір напою, а додає глибини та текстури.

Листя може використовуватися для створення колірного контрасту (наприклад, позолочене або срібне листя на темних напоях), підвищуючи драматизм подачі.

Ідеальний матеріал для включення у кубики льоду. Завдяки своїй делікатній структурі, листя створює витончену, "заморожену" композицію, що повільно тане, не вивільняючи кольору чи сильного смаку.

Ідеальний елемент для прикраси мусових тортів, желе, макаронів та цукерок. Листя може бути зафіксоване під прозорою глазур''ю або на шоколадних виробах, створюючи ефектний, крихкий вигляд.



Ключові аспекти: унікальна мереживна текстура, прозорий, повітряний вигляд, висока декоративна цінність для тонких робіт. Це делікатне, високоякісне та естетично впливове рішення для преміального, візуально орієнтованого бартендингу.',265,null,true,true,true,false,'50шт','{}'::text[],87,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('Mklqq8OlLTKSGwR8Gyp5',(select id from public.categories where slug = 'dried-flowers'),'Лаванда сушена','product-mklqq8olltksgwr8gyp5','Смаковий модифікатор з яскравим ароматом. Наші сушені бутони забезпечують інтенсивний, пряно-квітковий аромат та глибокий фіолетово-синій колір.

У барі- незамінний для препарації гірких настойок та надання комплексного профілю джиновим та горілчаним коктейлям. Ключовий елемент для коктейлів, що вимагають вишуканої, трав''яної ноти. Мастхев для створення авторських сиропів, настоянок (інфузій) для джину та горілки.
Натуральний засіб для приготування заспокійливого чаю або ароматизації домашнього цукру та випічки.

Ключові аспекти: інтенсивний, стійкий аромат, насичений, стабільний колір, потужний заспокійливий ефект та універсальність як модифікатора смаку.',195,null,true,true,true,false,'50г','{}'::text[],88,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('NFUxbOb1iRKbynsqERP7',(select id from public.categories where slug = 'decorations'),'Харчовий шимер Золотий','product-nfuxbob1irkbynsqerp7','Дрібнодисперсний, високоактивний пігмент для створення динамічного, глибокого мерехтіння всередині рідини. Це професійний засіб забезпечує інтенсивну іризацію та рівномірний перелив кольору, перетворюючи прозорі напої на видовищні композиції.



Доступний у широкій палітрі (золото, срібло, рожевий, синій), що дозволяє миттєво задати тон коктейлю та підкреслити смакові ноти візуальним рядом.



При додаванні до прозорих алкогольних чи безалкогольних напоїв та легкому збовтуванні шимер створює магнетичний ефект "зіркового пилу" або рухомого туману.

Ефект дзеркального переливу максимально відображається на фото та відео, роблячи напій винятково привабливим для соціальних мереж та маркетингу.



Ключові аспекти: глибоке, динамічне мерехтіння, легке суспендування у рідинах, висока концентрація, миттєва трансформація візуальної подачі.',225,null,true,true,true,false,'10г','{}'::text[],89,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('Na42CoWTgXGiEwqPdT7w',(select id from public.categories where slug = 'decorations'),'Ягоди годжі','product-na42cowtgxgiewqpdt7w','Високоцінний функціональний інгредієнт з інтенсивним червоно-помаранчевим кольором та збалансованим, кисло-солодким смаком. Ці сушені ягоди відомі своєю жувальною текстурою та високим вмістом антиоксидантів, що додає оздоровчого аспекту до будь-якої подачі.

Яскравий червоно-помаранчевий колір ягід створює контрастний візуальний акцент у прозорих, світлих або зелених напоях.
Ягоди можуть бути введені у напій (пунші, сангрія, настоянки) або залишені на дні келиха. Під час контакту з рідиною вони поступово виділяють свій тонкий, кисло-солодкий, трав''яний профіль, що збагачує смак.

Ідеально підходять як поживний, яскравий топінг для сніданкових боулів, йогуртів, салатів та граноли, підвищуючи візуальну привабливість та нутрієнтну цінність.
Їх насичений, стійкий колір є ідеальним для створення контрасту на білих, зелених або кремових поверхнях.

Ключові аспекти: яскравий колір, здатність до смакової інфузії, функціональна цінність (суперфуд), універсальність для харчових та напійних композицій.',110,null,true,true,true,false,'100г',array['ягоди годжі']::text[],90,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('P5AXvv1lmsvOpAzk6AtD',(select id from public.categories where slug = 'decorations'),'Барвник харчовий перламутровий Золотий пісок','product-p5axvv1lmsvopazk6atd','Висококонцентрований пігмент для створення дзеркального блиску та металізованого ефекту. Цей преміальний декоративний засіб забезпечує інтенсивну іризацію та глибокий перелив кольору на будь-якій поверхні.

Додавання мінімальної кількості у прозорі коктейлі або шампанське створює ефект "зіркового пилу" або рухомого, мерехтливого туману, підвищуючи яскравий ефект напою.
Може використовуватися для створення тонкого, перламутрового обідка (rimming) на келихах, що додає вишуканості та візуального контрасту напою.
Ідеально підходить для введення у прозорі глазурі або желе, створюючи глибокий, мерехтливий ефект (ефект "космічного" блиску) без помутніння основи.
Ключовий інструмент для надання елітного вигляду шоколадним виробам, макаронам та мусовим тортам.

Ключові аспекти: інтенсивний перламутровий блиск, універсальність (сухе та вологе застосування), висока концентрація для економічного використання, преміальний естетичний фініш.',115,null,true,true,true,false,'2г','{}'::text[],91,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('P7SUpSdBDXaOKBLNBbyt',(select id from public.categories where slug = 'decorations'),'Ізомальт зелений','product-p7supsdbdxaokblnbbyt','Технологічна основа для структурного, геометричного декору з ефектом кришталевої прозорості. Цей преміальний підсолоджувач забезпечує виняткову стійкість форми, ідеально підходячи для створення довговічних, нелипких прикрас.
Діаметр 3мм.


Ізомальт використовується для створення індивідуальних, прозорих прикрас, що розміщуються на обідку або поверхні напою. Його стійкість до вологи гарантує, що гарніш не стане липким і не потече від охолодження.
Можна застосовувати як тримач для ароматичних масел, які використовуються для ароматної активації перед вживанням коктейлю.
Для створення тонкого, прозорого обідка (rimming), який не кристалізується і не мутніє, як звичайний цукор. Це додає преміального блиску келиху.

Ключові аспекти: кришталева прозорість, стійкість до вологи та кристалізації, низький ризик карамелізації  роблять Ізомальт незамінним для інноваційного та преміального барного декору.',200,null,true,true,true,false,'40шт','{}'::text[],92,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('PNmFCSG55FIJiNKeMdAY',(select id from public.categories where slug = 'decorations'),'Коктейльний цукор Золотий','product-pnmfcsg55fijinkemday','Спеціалізована цукрова суміш для професійного оформлення обідка келиха (rimming). Цей продукт вирізняється стандартизованою фракцією (розміром кристалів), що забезпечує ідеальне прилипання та рівномірне покриття. Доступний у різних кольорах.



Цукор створює акуратний, візуально привабливий обідок для класичних та авторських коктейлів (Margarita, Cosmopolitan, Lemon Drop). Спеціальна текстура запобігає надмірному розсипанню та полегшує процес декорування.

Різні кольори цукру можуть слугувати для маркування напоїв або дотримання фірмового стилю закладу. Яскравий колір миттєво привертає увагу.



Ключові аспекти: стандартизована фракція для rimming, швидкість та легкість застосування, візуальний та смаковий контраст, підвищення якості презентації.',85,null,true,true,true,false,'70г','{}'::text[],93,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('Pgh5tDdT5ZEP29UmmFam',(select id from public.categories where slug = 'decorations'),'Ізомальт блакитний','product-pgh5tddt5zep29ummfam','Технологічна основа для структурного, геометричного декору з ефектом кришталевої прозорості. Цей преміальний підсолоджувач забезпечує виняткову стійкість форми, ідеально підходячи для створення довговічних, нелипких прикрас.
Діаметр 3мм.


Ізомальт використовується для створення індивідуальних, прозорих прикрас, що розміщуються на обідку або поверхні напою. Його стійкість до вологи гарантує, що гарніш не стане липким і не потече від охолодження.
Можна застосовувати як тримач для ароматичних масел, які використовуються для ароматної активації перед вживанням коктейлю.
Для створення тонкого, прозорого обідка (rimming), який не кристалізується і не мутніє, як звичайний цукор. Це додає преміального блиску келиху.

Ключові аспекти: кришталева прозорість, стійкість до вологи та кристалізації, низький ризик карамелізації  роблять Ізомальт незамінним для інноваційного та преміального барного декору.',200,null,true,true,true,false,'40шт','{}'::text[],94,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('PmHip8ehuUtZZ7AhJXmR',(select id from public.categories where slug = 'chips'),'Мандаринові чипси','product-pmhip8ehuutzz7ahjxmr','Насичений цитрусовий профіль у кожному слайсі. Наші мандаринові чипси — це тонкі слайси добірних мандаринів, висушені до стану ідеальної хрусткості. Вони поєднують концентровану фруктову солодкість з легкою цитрусовою гірчинкою цедри, створюючи багатогранний смак.

Для професіоналів (Барна культура): ідеальний вибір для створення зимових та новорічних коктейлів. Чудово поєднується з пряними ромами, бренді та лікерами. Мініатюрний розмір дозволяє створювати витончені та складні прикраси, а інтенсивний аромат миттєво створює святковий настрій.

Для домашнього вжитку (Гастрономія): додайте кілька слайсів до гарячого чаю, глінтвейну або какао, щоб наповнити дім затишним ароматом. Це чудова їстівна прикраса для випічки, кексів та шоколадних десертів.

Ключові аспекти: яскраво виражений солодкий смак та аромат, впізнаваний святковий характер, ідеальний розмір для витонченого декору.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',310,null,true,true,true,false,'100г',array['Мандарин','глюкозний сироп']::text[],95,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('QGLGU01DtBcWDXyuuE7C',(select id from public.categories where slug = 'decorations'),'Цукрові кульки Жовті','product-qglgu01dtbcwdxyuue7c','Універсальний, глянцевий декоративний елемент для створення візуального об''єму та святкового блиску. Ці рівномірно сформовані, тверді кристали забезпечують чистий колір та інтенсивне відбивання світла.

Розміри кульок 5-7мм.



Можуть використовуватися для обтяження або стабілізації легких елементів (наприклад, сухоцвітів) при їхньому кріпленні до основи гарнішу або для включення у кубики льоду як декоративний елемент. Їх тверда текстура мінімізує швидке розмокання від вологи келиха, що є ідеальним для десертних коктейлів та морозних напоїв.

Гладка, глянцева поверхня кульок забезпечує високий блиск, що миттєво підвищує святковість та естетичну привабливість готового виробу чи напою.



Ключові аспекти: стійка, тверда форма, інтенсивний блиск, візуальний об''єм, універсальність для створення святкового декору.',50,null,true,true,true,false,'100г','{}'::text[],96,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('QXAJgnlWiGtCkNcFJxAv',(select id from public.categories where slug = 'decorations'),'Скелетоване листя Чорні','product-qxajgnlwigtckncfjxav','Елегантна витонченість та текстурна прозорість для преміального декору. Скелетоване листя- це делікатний матеріал, що пройшов спеціалізовану обробку для видалення м''якої тканини, залишаючи лише тонку мереживну сітку жилок. Вони забезпечують легкий, повітряний та вишуканий візуальний ефект.



Скелетоване листя є високохудожнім, невагомим елементом декору, що ідеально підходить для елітних подач. Листя забезпечує вишуканий, мереживний ефект у прозорих напоях. Його напівпрозора структура не закриває колір напою, а додає глибини та текстури.

Листя може використовуватися для створення колірного контрасту (наприклад, позолочене або срібне листя на темних напоях), підвищуючи драматизм подачі.

Ідеальний матеріал для включення у кубики льоду. Завдяки своїй делікатній структурі, листя створює витончену, "заморожену" композицію, що повільно тане, не вивільняючи кольору чи сильного смаку.

Ідеальний елемент для прикраси мусових тортів, желе, макаронів та цукерок. Листя може бути зафіксоване під прозорою глазур''ю або на шоколадних виробах, створюючи ефектний, крихкий вигляд.



Ключові аспекти: унікальна мереживна текстура, прозорий, повітряний вигляд, висока декоративна цінність для тонких робіт. Це делікатне, високоякісне та естетично впливове рішення для преміального, візуально орієнтованого бартендингу.',265,null,true,true,true,false,'50шт','{}'::text[],97,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('Qi7o0wCkJPRNrC6jjDK2',(select id from public.categories where slug = 'dried-flowers'),'Мікс гортензії','product-qi7o0wckjprnrc6jjdk2','Естетична універсальність та багата кольорова палітра для вишуканого декору. Цей контрастний мікс являє собою поєднання натуральних відтінків (від ніжного рожевого до глибокого блакитного, фіолетового та кремового).

Ексклюзивний плаваючий гарніш для надання напоям вишуканої естетики. Завдяки своїй мінімальній вазі, пелюстки елегантно утримуються на поверхні келиха, для створення фотогенічних напоїв. Ідеальний для формування візуально складних та яскравих подач. Також слугує унікальним елементом для заморожування у кубиках льоду, що створює повільний та естетичний декор.
Високохудожній інструмент для фінального оформлення. Мікс ідеально підходить для елітної кондитерської лінії та гастрономічної подачі, де потрібен тонкий, естетичний акцент на тарілці. Забезпечує стабільний, тривалий візуальний ефект.

Ключові аспекти: широка гама природних кольорів, надзвичайно легка, повітряна текстура, довговічна естетика, безпечний, натуральний декоративний матеріал з високою фотогенічністю.',175,null,true,true,true,false,'8-10г','{}'::text[],98,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('QwZyhSVWzw04TIJI5QVJ',(select id from public.categories where slug = 'dried-flowers'),'Бутони лаванди','product-qwzyhsvwzw04tiji5qvj','Інтенсивний візуальний контраст та функціональний заспокійливий ефект. Сушені бутони лаванди забезпечують глибокий фіолетово-синій колір та концентрований квітково-трав''яний аромат, що є ключовим інструментом для створення напоїв зі складним сенсорним профілем.

Лаванда- це ідеальний ароматичний інструмент, що гарантує складний, багатошаровий профіль напою. Ключовий елемент для створення авторських настоянок, лавандового джину чи горілки. Лаванда повільно віддає свій аромат, надаючи алкоголю вишуканої, трав''яної бази без гіркоти.
Фундаментальний інгредієнт для приготування концентрованих лавандових сиропів та домашніх біттерів, які додають квіткову, заспокійливу ноту до будь-якого класичного коктейлю.
Невелика кількість бутонів, розтерта перед подачею, слугує потужним ароматичним акцентом для напоїв (особливо сауерів та коктейлів з піною), стимулюючи рецептори. Забезпечує стабільний, зігріваючий ефект у трав''яних та класичних чайних сумішах.

Кулінарна ароматизація: використовується для ароматизації цукру та солі у високій кухні. Незамінний компонент для елітної випічки (печиво, макарони), де потрібна тонка, але виразна квіткова нота.

Ключові аспекти: стійкий фіолетовий колір, чистота аромату, функціональність як модифікатора смаку, ідеально підходить для квітково-трав''яних профілів.',60,null,true,true,true,false,'10г','{}'::text[],99,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('RPQCpx5rNnZRojb5eFF7',(select id from public.categories where slug = 'chips'),'чипси Ківі','product-rpqcpx5rnnzrojb5eff7','Функціональний контраст та концентрована кислинка у кожному слайсі. Наші чипси з ківі — це ідеально висушені слайси стиглого плода. Вони пропонують насичений смарагдовий колір та фірмовий візерунок. Повільна дегідрація концентрує кисло-солодкий смак ківі та надає чипсам приємної хрусткої текстури.

Для професіоналів (Барна культура): ідеальний гарніш для освіжаючих коктейлів. Створює чудовий візуальний контраст у напоях на основі джину, горілки та світлого рому. Його соковитий вигляд миттєво додає коктейлю свіжості та екзотичного шарму.

Для домашнього вжитку (Гастрономія): використовуйте для прикрашання десертів — пана-коти, чізкейків або павлової, де їхній яскравий колір буде особливо виразним. Це також смачний та незвичайний снек, що сподобається і дітям, і дорослим.

Ключові аспекти: вражаючий смарагдово-зелений колір, унікальний природний візерунок, збалансований кисло-солодкий смак. Гарніш, що гарантовано приверне увагу.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',380,null,true,true,true,false,'100г',array['Ківі','глюкозний сирп']::text[],100,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('ReqQh6INEe6KVyZMNUNd',(select id from public.categories where slug = 'decorations'),'Скелетоване листя Жовті','product-reqqh6inee6kvyzmnund','Елегантна витонченість та текстурна прозорість для преміального декору. Скелетоване листя- це делікатний матеріал, що пройшов спеціалізовану обробку для видалення м''якої тканини, залишаючи лише тонку мереживну сітку жилок. Вони забезпечують легкий, повітряний та вишуканий візуальний ефект.



Скелетоване листя є високохудожнім, невагомим елементом декору, що ідеально підходить для елітних подач. Листя забезпечує вишуканий, мереживний ефект у прозорих напоях. Його напівпрозора структура не закриває колір напою, а додає глибини та текстури.

Листя може використовуватися для створення колірного контрасту (наприклад, позолочене або срібне листя на темних напоях), підвищуючи драматизм подачі.

Ідеальний матеріал для включення у кубики льоду. Завдяки своїй делікатній структурі, листя створює витончену, "заморожену" композицію, що повільно тане, не вивільняючи кольору чи сильного смаку.

Ідеальний елемент для прикраси мусових тортів, желе, макаронів та цукерок. Листя може бути зафіксоване під прозорою глазур''ю або на шоколадних виробах, створюючи ефектний, крихкий вигляд.



Ключові аспекти: унікальна мереживна текстура, прозорий, повітряний вигляд, висока декоративна цінність для тонких робіт. Це делікатне, високоякісне та естетично впливове рішення для преміального, візуально орієнтованого бартендингу.',265,null,true,true,true,false,'50шт','{}'::text[],101,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('T1tuw3MQ3oPvRJjTStET',(select id from public.categories where slug = 'chips'),'Апельсинові чипси ','product-t1tuw3mq3opvrjjtstet','Незмінна естетика та теплий цитрусовий профіль у кожному слайсі. Наші апельсинові чипси — це ідеально тонкі слайси. Контрольована дегідрація забезпечує стабільну, напівпрозору форму та концентрує аромат цитрусу. Результатом є універсальний чіпс, що пропонує красу, концентрований аромат та натуральний смак.

Для професіоналів (Барна культура): стандартний, надійний гарніш для таких напоїв, як Negroni, Aperol Spritz та різноманітних сауерів. Ключова перевага: на відміну від свіжого слайсу, чипс є нейтральним до балансу напою, поступово додаючи лише теплий цитрусовий аромат. Це гарантує стабільність смаку та преміальну візуальну якість подачі.

Для домашнього вжитку (Гастрономія): елемент швидкого святкового оформлення будь-якого напою — від лимонаду до ігристого. Ідеально підходить як їстівна, натуральна прикраса для десертів (чізкейків, кексів, пана-коти). Може слугувати і самостійною, елегантною та корисною закускою.

Ключові аспекти: ефектний напівпрозорий вигляд, інтенсивний аромат апельсина з легким карамельним відтінком, багатофункціональність використання та бездоганна естетика без зайвих зусиль.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',215,null,true,true,true,false,'100г',array['Апельсин','глюкозний сироп','сіль']::text[],102,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('T2cM6wGfc3MblAkmzHDa',(select id from public.categories where slug = 'dried-flowers'),'Колоски декоративні Помаранчеві','product-t2cm6wgfc3mblakmzhda','Натуральна естетика та структурний акцент у декоративному оформленні. Ці добірні, висушені стебла (колоски) зі збереженою природною формою є стабільним, екологічним елементом для створення автентичних композицій.



У барній культурі можуть використовуватися для оригінального декору та надання напоям сезонного, теплого вайбу. Ідеально підходять для фотогенічних подач, простий засіб для додавання затишного, природного акценту.



Ключові аспекти: автентичний вигляд, стабільна суха структура, універсальність для створення тематичних композицій.',200,null,true,true,true,false,'50шт','{}'::text[],103,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('VJp7NrmuJAHpwL15d4c7',(select id from public.categories where slug = 'chips'),'Лаймові чипси ','product-vjp7nrmujahpwl15d4c7','Зухвала кислинка та яскравий аромат лайма для ваших сміливих міксів! Створені зі свіжих лаймів, ці чипси зберігають свій насичений зелений колір та фірмовий цитрусовий характер. Делікатна обробка та повільна сушка концентрують їхній смак, роблячи його ідеальним фінальним штрихом для будь-якого напою.

Для професіоналів (Барна культура): незамінний елемент для подачі Mojito, Gin & Tonic або Caipirinha. На відміну від свіжого слайса, чипс не розбавляє напій зайвою вологою, а додає інтенсивний аромат та ефектний візуальний контраст, що виглядає бездоганно до останньої краплі.

Для домашнього вжитку (Гастрономія): додайте іскру в страви. Покришіть чіпс, щоб створити ароматну посипку, або просто покладіть у келих.

Ключові аспекти: інтенсивна, чиста кислинка лайма, вражаючий зовнішній вигляд та функціональність.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',385,null,true,true,true,false,'100г',array['Лайм','глюкозний сироп','сіль']::text[],104,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('Wg0ZT0dZ3myKWbGd6Xnn',(select id from public.categories where slug = 'decorations'),'Коктейльний цукор Рожевий','product-wg0zt0dz3mykwbgd6xnn','Спеціалізована цукрова суміш для професійного оформлення обідка келиха (rimming). Цей продукт вирізняється стандартизованою фракцією (розміром кристалів), що забезпечує ідеальне прилипання та рівномірне покриття. Доступний у різних кольорах.



Цукор створює акуратний, візуально привабливий обідок для класичних та авторських коктейлів (Margarita, Cosmopolitan, Lemon Drop). Спеціальна текстура запобігає надмірному розсипанню та полегшує процес декорування.

Різні кольори цукру можуть слугувати для маркування напоїв або дотримання фірмового стилю закладу. Яскравий колір миттєво привертає увагу.



Ключові аспекти: стандартизована фракція для rimming, швидкість та легкість застосування, візуальний та смаковий контраст, підвищення якості презентації.',85,null,true,true,true,false,'70г','{}'::text[],105,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('WpqMYeHzD4fymCASrqcQ',(select id from public.categories where slug = 'decorations'),'Прищіпка дерев''яна 2,5см','product-wpqmyehzd4fymcasrqcq','Інструмент для прецизійної фіксації гарнішу та еко-акцент у барній подачі. Цей компактний аксесуар з натуральної деревини забезпечує надійне, але делікатне кріплення, що є критично важливим для створення акуратних та стильних напоїв.

Ідеально підходить для стабільного кріплення цитрусового слайса або пучка свіжої м''яти/розмарину до обідка келиха. Це запобігає зануренню гарнішу в напій та максимізує його ароматичну ефективність.
Використовується для прикріплення сухих квітів чи фірмових паперових ярликів до соломинки або гілочки кориці, надаючи напою персоналізованого вигляду.
Малий розмір (2.5см) забезпечує, що прищіпка не перевантажує візуально гарніш, зберігаючи витончений, професійний вигляд.

Ключові аспекти: універсальність для пакування та декору, точна фіксація гарнішу, компактний розмір (2.5см), натуральний матеріал, функціональність для підвищення рівня барної презентації.',145,null,false,true,true,false,'100шт','{}'::text[],106,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('XT3Nx99IiUNpGNYKnFoZ',(select id from public.categories where slug = 'syrups'),'Абрикос ','product-xt3nx99iiunpgnyknfoz','Сироп Абрикос Dream: Справжній сонячний оксамит, що увібрав у себе все тепло стиглого південного саду. Ми вловили саму суть медової, соковитої м''якоті стиглого абрикоса та її ніжний, запашний аромат. Цей густий сироп насиченого бурштинового кольору подарує вашим напоям (коктейлям, лимонадам, десертам) м''яку, оксамитову солодкість та яскравий, теплий відтінок. Додайте Абрикос Dream — і наповніть свій келих рідким сонцем та ароматом літа!',350,null,false,true,false,false,'1 л',array['Цукор','вода','натуральний ароматизатор абрикосу','барвник: Е133']::text[],107,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('XkxzfWtFXLluOHNJDiIB',(select id from public.categories where slug = 'decorations'),'Хрусткі шоколадні кульки мікс 5мм','product-xkxzfwtfxlluohnjdiib','Комплексний декоративний топінг, що поєднує інтенсивний хруст основи та гладкий, насичений смак високоякісного шоколаду. Мікс включає кульки, покриті молочним, темним та білим шоколадом, забезпечуючи візуальну та текстурну різноманітність.
Поєднання різних видів шоколаду в одному міксі пропонує комплексний смаковий профіль для споживача.

Ключові аспекти: подвійна текстура (хруст + шоколад), візуальна різноманітність (мікс), висока стабільність для тривалої презентації, універсальність застосування.',130,null,true,true,true,false,'100г','{}'::text[],108,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('Z1PnIXXiu4sgu5n8BInX',(select id from public.categories where slug = 'dried-flowers'),'Колоски декоративні Натуральні','product-z1pnixxiu4sgu5n8binx','Натуральна естетика та структурний акцент у декоративному оформленні. Ці добірні, висушені стебла (колоски) зі збереженою природною формою є стабільним, екологічним елементом для створення автентичних композицій.

У барній культурі можуть використовуватися для оригінального декору та надання напоям сезонного, теплого вайбу. Ідеально підходять для фотогенічних подач, простий засіб для додавання затишного, природного акценту.

Ключові аспекти: автентичний вигляд, стабільна суха структура, універсальність для створення тематичних композицій.',200,null,true,true,true,false,'50шт','{}'::text[],109,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('Zi1NAFAiMBqTZzoxYXf3',(select id from public.categories where slug = 'dried-flowers'),'Гомфрена сушена різнокольорова','product-zi1nafaimbqtzzoxyxf3','Геометрична точність та яскравість кольору для акцентованого декору. Сушена гомфрена являє собою мініатюрні бутони сферичної форми, які пройшли спеціалізовану обробку для збереження їхнього інтенсивного пурпурово-рожевого відтінку. Цей сухоцвіт забезпечує візуальну стабільність та елегантну естетику.

Ідеальний інструмент для мінімалістичного та точкового оформлення. Завдяки своїй щільній структурі, бутони елегантно тримаються на поверхні коктейлів, наприклад, на пінці. Незамінний для декорування весільних макаронів, цукерок-трюфелів та елітних чайних сумішей. Використовуйте для створення кришталево чистого льоду з квітковим включенням, що додає напою ексклюзивності. Бутони можуть використовуватися для делікатної інфузії чаю. Довговічна прикраса для декорування подарунків, свічок або створення ароматичних сумішей, що зберігають свій колір протягом тривалого часу.

Ключові аспекти: точна сферична форма, висока стійкість до вологи, функціональність для вишуканого, стабільного декору та тривалий термін збереження кольору.',55,null,true,true,true,false,'30шт','{}'::text[],110,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('a361f83a-43f1-47bc-9e31-5aa2d8e9f117',(select id from public.categories where slug = 'syropy'),'Сироп "Мед"','syrup-мед','Сироп "Мед" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор мед','Барвник: Е133']::text[],111,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('a9d21de0-78e4-42f2-aac9-9e54faeb9c01',(select id from public.categories where slug = 'syropy'),'Сироп "Лайм"','syrup-лайм','Сироп "Лайм" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор лайм','Барвник: Е133']::text[],112,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('aQ53s4c0JbUTU9ivoBzX',(select id from public.categories where slug = 'decorations'),'Піропапір зникаючий - 48х20см','product-aq53s4c0jbutu9ivobzx','Спеціалізований целюлозний аркуш для створення контрольованих, вражаючих вогняних ефектів. Великий формат (48х20см) дозволяє отримати максимально потужний спалах та нульовий залишок після згорання.

Піропапір- це контрольований інструмент для створення сенсорного та візуального шоу без ризику забруднення. Завдяки чистому згоранню та відсутності золи, папір може бути використаний безпосередньо біля келиха, що забезпечує безпечний Wow-ефект на барній стійці.
Ключовий інструмент для преміальної, театралізованої подачі коктейлів. Невеликі, скручені шматочки можуть бути використані для ефектного запалювання сигари або ароматичного дерева для певних видів коктейлів (наприклад, Smoked Old Fashioned), підкреслюючи концепцію та ритуал подачі.
Використовується для драматичного запалювання сухого гарнішу (наприклад, паличок кориці, зірочок анісу чи сухої цедри), що створює яскравий спалах та миттєво активує ефірні олії, посилюючи аромат навколо келиха.

Матеріал розроблений для миттєвого згорання, що робить його безпечним для використання у приміщеннях при дотриманні правил пожежної безпеки, оскільки він не залишає слідів на одязі чи поверхнях.

Ключові аспекти: миттєвий спалах, чиста ароматична активація та нульові залишки для ефектної барної подачі.',130,null,false,true,true,false,'48х20см','{}'::text[],113,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('aRx9aNDFg4txjxfTNvrJ',(select id from public.categories where slug = 'dried-flowers'),'Пелюстки півонії сушені','product-arx9andfg4txjxftnvrj','Витончений квітковий акцент та насичений колір у кожній пелюстці. Наші пелюстки півонії — це результат контрольованої дегідрації, що дозволила зафіксувати їхню глибоку рожево-пурпурну палітру та делікатний, злегка солодкуватий аромат. Продукт ідеально підходить для преміального оформлення та ароматизації.

Висококласний декоративний елемент. У барній сфері можуть використовуватись для інфузії сиропів або як елегантний гарніш для коктейлів на основі джину та просекко, додаючи вишуканої ноти.  Натуральний інгредієнт для створення ароматного та заспокійливого чаю або ароматизації домашнього цукру. Ідеально підходять для фінальної прикраси тортів, макаронів, зефіру та інших десертів.

Ключові аспекти: ніжний, солодкувато-квітковий аромат, яскравий природний колір, елегантний вигляд та універсальність для декору та напоїв.',110,null,true,true,true,false,'50г','{}'::text[],114,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('aaM6V7Tb39IuTIsN9sWO',(select id from public.categories where slug = 'decorations'),'Мигдальні пелюстки','product-aam6v7tb39iutisn9swo','Витончений, високоякісний горіховий інгредієнт для кондитерських та кулінарних робіт. Ці тонкі, рівномірно нарізані слайси бланшованого мигдалю забезпечують делікатний, чистий смак та легку, хрустку текстуру.

Мигдальні пелюстки слугують унікальним текстурним та ароматичним акцентом у спеціалізованих коктейльних подачах.
Є ідеальним топінгом для шарів піни, білкових чи вершкових шапок на коктейлях, додаючи візуальної привабливості та контрастного горіхового аромату.
Забезпечують великий, помітний елемент для оформлення обідка келиха (rimming), створюючи хрустку та горіхову основу для напоїв, що містять амаретто, ром або вершкові лікери.

Ідеальний матеріал для обсипання боків тортів, кексів та печива, забезпечуючи візуальну елегантність та приємний текстурний контраст. Використовуються як хрусткий, поживний топінг для салатів, гарнірів та страв азійської кухні. Вони додають балансуючої горіхової ноти без зайвої важкості.

Ключові аспекти: текстурний контраст, горіхова ароматика та преміальний, унікальний вигляд для нішевих напоїв.',150,null,true,true,true,false,'100г',array['мигдаль']::text[],115,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('aaa99a08-de05-4fdc-9d68-185a1d3c7661',(select id from public.categories where slug = 'syropy'),'Сироп "Лимонний пиріг"','syrup-лимонний-пиріг','Сироп "Лимонний пиріг" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор лимонний пиріг','Барвник: Е133']::text[],116,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('acd56a68-47e7-4271-972b-7b901dfc133c',(select id from public.categories where slug = 'syropy'),'Сироп "Ревінь"','syrup-ревінь','Сироп "Ревінь" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор ревінь','Барвник: Е133']::text[],117,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('b03301a5-99df-427c-9b94-cf63c656374f',(select id from public.categories where slug = 'syropy'),'Сироп "Ваніль"','syrup-ваніль','Сироп "Ваніль" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор ваніль','Барвник: Е133']::text[],118,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('b6zgH5FUFfImxyocfuAx',(select id from public.categories where slug = 'decorations'),'Посипка фігурна срібна “Зірочки”','product-b6zgh5fuffimxyocfuax','Декоративний елемент преміум-класу для створення металевого блиску та тематичного акценту. Ці тверді, рівномірно сформовані зірочки вкриті інтенсивним срібним пігментом, що забезпечує стабільність форми.

Розсипані по поверхні щільної білкової піни, зірочки імітують ефект "зоряного неба", надаючи класичній подачі драматичного, тематичного вигляду.
Завдяки твердій структурі, зірочки не розчиняються і можуть бути вморожені у прозорі кубики льоду, створюючи елегантний, повільно "танучий" декор.
Срібний, металевий фініш забезпечує максимальне відбивання світла, роблячи будь-яку подачу винятково фотогенічною.

Ключові аспекти: тематична форма (“Зірочки”), інтенсивний срібний блиск, висока стабільність (не розмокає), універсальність для створення виняткового барного декору.',60,null,true,true,true,false,'50г','{}'::text[],119,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('b71a7a9d-7950-4844-94e9-330c6b68bf7d',(select id from public.categories where slug = 'syropy'),'Сироп "Кориця"','syrup-кориця','Сироп "Кориця" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор кориця','Барвник: Е133']::text[],120,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('b99761b6-819b-4c7b-b66a-e4a0d9974e68',(select id from public.categories where slug = 'syropy'),'Сироп "Бергамот"','syrup-бергамот','Сироп "Бергамот" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор бергамот','Барвник: Е133']::text[],121,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('bJlQZYD8ntIntjo9Nvnv',(select id from public.categories where slug = 'decorations'),'Ізомальт прозорий','product-bjlqzyd8ntintjo9nvnv','Технологічна основа для структурного, геометричного декору з ефектом кришталевої прозорості. Цей преміальний підсолоджувач забезпечує виняткову стійкість форми, ідеально підходячи для створення довговічних, нелипких прикрас.
Діаметр 3мм.


Ізомальт використовується для створення індивідуальних, прозорих прикрас, що розміщуються на обідку або поверхні напою. Його стійкість до вологи гарантує, що гарніш не стане липким і не потече від охолодження.
Можна застосовувати як тримач для ароматичних масел, які використовуються для ароматної активації перед вживанням коктейлю.
Для створення тонкого, прозорого обідка (rimming), який не кристалізується і не мутніє, як звичайний цукор. Це додає преміального блиску келиху.

Ключові аспекти: кришталева прозорість, стійкість до вологи та кристалізації, низький ризик карамелізації  роблять Ізомальт незамінним для інноваційного та преміального барного декору.',200,null,true,true,true,false,'40шт',array['ізомальт']::text[],122,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('bcd510be-3b14-4a5e-b86c-cbda662c4b24',(select id from public.categories where slug = 'syropy'),'Сироп "Імбирний пряник"','syrup-імбирний-пряник','Сироп "Імбирний пряник" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор імбирний пряник','Барвник: Е133']::text[],123,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('bluqJ5b85le3jyf5yqAW',(select id from public.categories where slug = 'chips'),'чипси Сицилійських Апельсинів ','product-bluqj5b85le3jyf5yqaw','Смак сонячної Сицилії, втілений у кожному слайсі. Ці чипси виготовлені з червоних сицилійських апельсинів, чия м''якоть має насичений рубіновий відтінок. Повільна дегідрація перетворює їх на вишуканий декор з унікальним мармуровим візерунком та глибоким, насіченим ароматом.

Для професіоналів (Барна культура): це елітний гарніш для створення напоїв преміум-класу. Ідеально підкреслить смак авторських коктейлів, варіацій на Negroni або Old Fashioned. Його драматичний вигляд стане центральним елементом подачі, що миттєво підвищує статус напою.

Для домашнього вжитку (Гастрономія): додайте нотку розкоші до келиха просекко чи шампанського. Використовуйте як ексклюзивну прикрасу для шоколадних десертів, пана-коти або для сервірування сирної тарілки з витриманими сирами.

Ключові аспекти: унікальний, складний смак, неповторний рубіново-червоний колір, ексклюзивність походження. Це не просто гарніш, а заява про витончений смак.


У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',285,null,true,true,true,true,'100г',array['Сицилійський апельсин','глюкозний сироп','сіль']::text[],124,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('bpa2rF4HBb2WaTWjto9u',(select id from public.categories where slug = 'dried-flowers'),'Гортензія Біла','product-bpa2rf4hbb2watwjto9u','Естетична універсальність та багата кольорова палітра для вишуканого декору. Цей контрастний мікс являє собою поєднання натуральних відтінків (від ніжного рожевого до глибокого блакитного, фіолетового та кремового).



Ексклюзивний плаваючий гарніш для надання напоям вишуканої естетики. Завдяки своїй мінімальній вазі, пелюстки елегантно утримуються на поверхні келиха, для створення фотогенічних напоїв. Ідеальний для формування візуально складних та яскравих подач. Також слугує унікальним елементом для заморожування у кубиках льоду, що створює повільний та естетичний декор.

Високохудожній інструмент для фінального оформлення. Мікс ідеально підходить для елітної кондитерської лінії та гастрономічної подачі, де потрібен тонкий, естетичний акцент на тарілці. Забезпечує стабільний, тривалий візуальний ефект.



Ключові аспекти: широка гама природних кольорів, надзвичайно легка, повітряна текстура, довговічна естетика, безпечний, натуральний декоративний матеріал з високою фотогенічністю.',175,null,true,true,true,false,'8-10г','{}'::text[],125,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('c47bb719-2d00-42a0-b8b7-ebd6c34d0901',(select id from public.categories where slug = 'syropy'),'Сироп "Дика вишня"','syrup-дика-вишня','Сироп "Дика вишня" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор дика вишня','Барвник: Е133']::text[],126,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('c708ed56-85f6-4e47-af21-25cbcb0ec3e8',(select id from public.categories where slug = 'syropy'),'Сироп "Огірковий"','syrup-огірковий','Сироп "Огірковий" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор огірковий','Барвник: Е133']::text[],127,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('c93b96f1-503e-45a4-8aa7-7354cc732a3b',(select id from public.categories where slug = 'syropy'),'Сироп "Грейпфрут"','syrup-грейпфрут','Сироп "Грейпфрут" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор грейпфрут','Барвник: Е133']::text[],128,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('c9f0ede2-be44-4140-9935-ba80c6f92d86',(select id from public.categories where slug = 'syropy'),'Сироп "Карамель з сіллю"','syrup-карамель-з-сіллю','Сироп "Карамель з сіллю" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор карамель з сіллю','Барвник: Е133']::text[],129,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('cIMbe3CHx983vcmJhY6u',(select id from public.categories where slug = 'chips'),'Мангові чипси','product-cimbe3chx983vcmjhy6u','Тропічна розкіш та концентрована солодкість у кожному слайсі. Наші мангові чипси виготовлені з добірних, соковитих плодів стиглого манго, що зберегли свій насичений солодкий смак та екзотичний аромат. Повільна дегідрація надає їм яскравого золотисто-помаранчевого кольору.

Для професіоналів (Барна культура): ідеальний гарніш для надання тропічної розкоші будь-якому напою. Чудово доповнює коктейлі на основі рому, текіли та кашаси, а також додає екзотичну нотку в келих ігристого вина.

Для домашнього вжитку (Гастрономія): смачний та поживний снек, що стане здоровою альтернативою цукеркам. Додавайте до ранкової граноли, йогурту або використовуйте для прикрашання тортів та десертів. Чудово смакує в поєднанні з гострими сирами на сирній тарілці.

Ключові аспекти: насичений солодкий смак екзотичного манго, яскравий сонячний колір. Це універсальний продукт, що дарує смак літа.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',310,null,true,true,true,false,'100г',array['Манго','глюкозний сироп']::text[],130,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('cbkMSAwufS5hFnkKsRsw',(select id from public.categories where slug = 'decorations'),'Харчовий шимер Рожевий','product-cbkmsawufs5hfnkksrsw','Дрібнодисперсний, високоактивний пігмент для створення динамічного, глибокого мерехтіння всередині рідини. Це професійний засіб забезпечує інтенсивну іризацію та рівномірний перелив кольору, перетворюючи прозорі напої на видовищні композиції.



Доступний у широкій палітрі (золото, срібло, рожевий, синій), що дозволяє миттєво задати тон коктейлю та підкреслити смакові ноти візуальним рядом.



При додаванні до прозорих алкогольних чи безалкогольних напоїв та легкому збовтуванні шимер створює магнетичний ефект "зіркового пилу" або рухомого туману.

Ефект дзеркального переливу максимально відображається на фото та відео, роблячи напій винятково привабливим для соціальних мереж та маркетингу.



Ключові аспекти: глибоке, динамічне мерехтіння, легке суспендування у рідинах, висока концентрація, миттєва трансформація візуальної подачі.',225,null,true,true,true,false,'10г','{}'::text[],131,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('cc2ca301-3cbf-4838-890d-f6385e8d2837',(select id from public.categories where slug = 'syropy'),'Сироп "Тархун"','syrup-тархун','Сироп "Тархун" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор тархун','Барвник: Е133']::text[],132,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('cece3c67-125c-40f9-8740-5c31299b06d5',(select id from public.categories where slug = 'syropy'),'Сироп "Суниця"','syrup-суниця','Сироп "Суниця" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор суниця','Барвник: Е133']::text[],133,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('cf6a3146-617e-4100-bea6-c01204d33a09',(select id from public.categories where slug = 'syropy'),'Сироп "Крем-сода"','syrup-крем-сода','Сироп "Крем-сода" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор крем-сода','Барвник: Е133']::text[],134,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('d0d9c223-0b92-420c-9f00-428e8ec88153',(select id from public.categories where slug = 'syropy'),'Сироп "Бейліс"','syrup-бейліс','Сироп "Бейліс" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор бейліс','Барвник: Е133']::text[],135,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('d2c014f2-39ab-4666-8ce4-a2a523fbde8d',(select id from public.categories where slug = 'syropy'),'Сироп "Малина"','syrup-малина','Сироп "Малина" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор малина','Барвник: Е133']::text[],136,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('d7646583-8ad5-43e4-89f9-8ba52fb76bdc',(select id from public.categories where slug = 'syropy'),'Сироп "Цукровий тростник"','syrup-цукровий-тростник','Сироп "Цукровий тростник" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор цукровий тростник','Барвник: Е133']::text[],137,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('d863c124-fd73-44e1-9ab6-cdc456f36b07',(select id from public.categories where slug = 'syropy'),'Сироп "Ром"','syrup-ром','Сироп "Ром" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор ром','Барвник: Е133']::text[],138,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('dMCm1kcELbBpFpk1HOOT',(select id from public.categories where slug = 'decorations'),'Цукрові кульки Білі','product-dmcm1kcelbbpfpk1hoot','Універсальний, глянцевий декоративний елемент для створення візуального об''єму та святкового блиску. Ці рівномірно сформовані, тверді кристали забезпечують чистий колір та інтенсивне відбивання світла.
Розміри кульок 5-7мм.

Можуть використовуватися для обтяження або стабілізації легких елементів (наприклад, сухоцвітів) при їхньому кріпленні до основи гарнішу або для включення у кубики льоду як декоративний елемент. Їх тверда текстура мінімізує швидке розмокання від вологи келиха, що є ідеальним для десертних коктейлів та морозних напоїв.
Гладка, глянцева поверхня кульок забезпечує високий блиск, що миттєво підвищує святковість та естетичну привабливість готового виробу чи напою.

Ключові аспекти: стійка, тверда форма, інтенсивний блиск, візуальний об''єм, універсальність для створення святкового декору.',50,null,true,true,true,false,'100г','{}'::text[],139,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('dc48942e-1db0-46dd-b1c6-34db23086d3d',(select id from public.categories where slug = 'syropy'),'Сироп "Карамель"','syrup-карамель','Сироп "Карамель" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор карамель','Барвник: Е133']::text[],140,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('dcXsW2tOSu2ioNjjy57v',(select id from public.categories where slug = 'chips'),'Ананасові чипси (півкільця)','product-dcxsw2tosu2ionjjy57v','Концентрована тропічна солодкість та ідеальна форма у кожному слайсі. Повільна дегідрація зберігає їхній насичений золотистий колір та фірмовий аромат, забезпечуючи стабільну, хрустку текстуру. Ідеальна форма для будь-яких ідей. Кожен слайс- це концентрована солодкість та аромат ананаса, збережені в кожному шматочку.

Для професіоналів (Барна культура): універсальний гарніш, що ідеально розміщується на обідку будь-якого келиха — від "Коллінз" до "Маргарити". Півкільце є чудовим доповненням до класичних тікі-коктейлів та пуншів. Його форма дозволяє створювати елегантні, лаконічні прикраси, не перевантажуючи візуальну композицію.

Для домашнього вжитку (Гастрономія): це готова, корисна закуска, що ефективно задовольняє потребу в солодкому. Використовуйте півкільця для декорування бортиків тортів, додавайте до фруктових салатів або просто занурюйте в розтоплений шоколад, створюючи вишуканий десерт.

Ключові аспекти: чистий тропічний смак, класична та зручна для оформлення форма, повна натуральність продукту. Це оптимальне рішення, коли потрібен швидкий та ефектний гарніш.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',395,null,true,true,true,true,'100г',array['Ананас','глюкозний сироп']::text[],141,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('dmAtzqLWolMRm7oQhwzZ',(select id from public.categories where slug = 'decorations'),'Цукрові кульки Рожеві','product-dmatzqlwolmrm7oqhwzz','Універсальний, глянцевий декоративний елемент для створення візуального об''єму та святкового блиску. Ці рівномірно сформовані, тверді кристали забезпечують чистий колір та інтенсивне відбивання світла.

Розміри кульок 5-7мм.



Можуть використовуватися для обтяження або стабілізації легких елементів (наприклад, сухоцвітів) при їхньому кріпленні до основи гарнішу або для включення у кубики льоду як декоративний елемент. Їх тверда текстура мінімізує швидке розмокання від вологи келиха, що є ідеальним для десертних коктейлів та морозних напоїв.

Гладка, глянцева поверхня кульок забезпечує високий блиск, що миттєво підвищує святковість та естетичну привабливість готового виробу чи напою.



Ключові аспекти: стійка, тверда форма, інтенсивний блиск, візуальний об''єм, універсальність для створення святкового декору.',50,null,true,true,true,false,'100г','{}'::text[],142,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('e10faa4c-4d10-4473-bf3f-5cc604ea429b',(select id from public.categories where slug = 'syropy'),'Сироп "Чай зелений"','syrup-чай-зелений','Сироп "Чай зелений" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор чай зелений','Барвник: Е133']::text[],143,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('e1d6a44e-73fc-4315-939e-8921c0829318',(select id from public.categories where slug = 'syropy'),'Сироп "Лісова ягода"','syrup-лісова-ягода','Сироп "Лісова ягода" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор лісова ягода','Барвник: Е133']::text[],144,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('e51638c3-d3d5-4504-a932-26d7c1c882c2',(select id from public.categories where slug = 'syropy'),'Сироп "Ірландський крем"','syrup-ірландський-крем','Сироп "Ірландський крем" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор ірландський крем','Барвник: Е133']::text[],145,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('e54a2eb1-cfba-45b5-a511-49bfbef2d894',(select id from public.categories where slug = 'syropy'),'Сироп "Банан жовтий"','syrup-банан-жовтий','Сироп "Банан жовтий" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор банан жовтий','Барвник: Е133']::text[],146,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('e67b6ad8-b6a1-4a55-a160-8d1066c79e91',(select id from public.categories where slug = 'syropy'),'Сироп "Личі"','syrup-личі','Сироп "Личі" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор личі','Барвник: Е133']::text[],147,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('e7691253-e9f3-4018-9e9a-2d20168a3f23',(select id from public.categories where slug = 'syropy'),'Сироп "М''ята"','syrup-мята','Сироп "М''ята" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор м''ята','Барвник: Е133']::text[],148,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('e8d3fa99-01d1-482f-894f-7cd1e68d8591',(select id from public.categories where slug = 'syropy'),'Сироп "Слива"','syrup-слива','Сироп "Слива" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор слива','Барвник: Е133']::text[],149,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('ecd836a4-f7af-49f4-8e75-7b2da475dcb7',(select id from public.categories where slug = 'syropy'),'Сироп "Лаванда"','syrup-лаванда','Сироп "Лаванда" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор лаванда','Барвник: Е133']::text[],150,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('ef6f40be-42bf-4a55-93b0-1fadb9dccdcf',(select id from public.categories where slug = 'syropy'),'Сироп "Абрикос"','syrup-абрикос','Сироп "Абрикос" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор абрикос','Барвник: Е133']::text[],151,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('eiiAvXgwcvz8Tu78nl1F',(select id from public.categories where slug = 'chips'),'Карамболеві чипси ','product-eiiavxgwcvz8tu78nl1f','Справжня зірка вашого коктейлю. Наші чипси виготовлені з екзотичної карамболи, або "зоряного фрукта", кожен зріз якої має ідеальну природну форму п''ятикутної зірки. Повільна дегідрація надає слайсам золотистого відтінку та приємної хрусткої текстури, зберігаючи унікальний кисло-солодкий смак, що нагадує суміш яблука, винограду та цитруса.

Для професіоналів (Барна культура): це гарнір-враження, створений, щоб дивувати. Ідеальний для прикрашання святкових та преміальних коктейлів, особливо в поєднанні з ігристим вином, джином або світлим ромом. Одна зірочка на краю келиха або на пінці напою миттєво перетворює його на витвір мистецтва.

Для домашнього вжитку (Гастрономія): найпростіший спосіб вразити гостей. Прикрасьте будь-який напій, від домашнього лимонаду до келиха просекко, щоб надати йому екзотичного та святкового вигляду. Також це чудова їстівна прикраса для тортів, кексів та фруктових салатів.

Ключові аспекти: бездоганна природна форма зірки, унікальний освіжаючий смак та гарантований вау-ефект. Це декор, який робить будь-яку подачу незабутньою.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',395,null,true,true,true,false,'100г',array['Карамбола','глюкозний сироп']::text[],152,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('f41f618b-2240-49c7-8658-1796ef2f2857',(select id from public.categories where slug = 'syropy'),'Сироп "Фісташка"','syrup-фісташка','Сироп "Фісташка" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор фісташка','Барвник: Е133']::text[],153,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('f628c03c-01d3-4479-850a-558b2f454460',(select id from public.categories where slug = 'syropy'),'Сироп "Чорна смородина"','syrup-чорна-смородина','Сироп "Чорна смородина" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор чорна смородина','Барвник: Е133']::text[],154,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('fURqp8n4rcFAKXjWH7Fr',(select id from public.categories where slug = 'chips'),'Яблучні чипси (кружальця)','product-furqp8n4rcfakxjwh7fr','Затишний смак домашнього саду в кожному хрусткому слайсі. Наші яблучні чипси виготовлені з добірних соковитих яблук, що зберегли свій природний кисло-солодкий баланс. Повільна дегідрація надає їм ідеальної крихкої текстури та концентрує впізнаваний аромат.

Для професіоналів (Барна культура): універсальний гарніш для сезонних коктейлів. Ідеально доповнює напої на основі віскі, кальвадосу, бренді та пряного рому. Незамінний для гарячих глінтвейнів, сидрів та пуншів, яким він додає не лише смаку, але й завершеного естетичного вигляду.

Для домашнього вжитку (Гастрономія): здорова та смачна закуска для всієї родини. Додавайте хрусту та солодкості до ранкової вівсянки, граноли чи йогурту. Це також класичне доповнення до сирної тарілки, особливо в поєднанні з чеддером або брі.

Ключові аспекти: впізнаваний, улюблений з дитинства смак, приємна легка текстура, неймовірна універсальність у застосуванні — від напоїв до корисних перекусів.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',305,null,true,true,true,false,'100г',array['Яблуко','глюкозний сироп']::text[],155,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('fb279987-6c70-4939-b435-92951f8512cb',(select id from public.categories where slug = 'syropy'),'Сироп "Журавлина"','syrup-журавлина','Сироп "Журавлина" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.',350,null,false,true,true,false,'1000 мл',array['Цукор','Вода','Натуральний ароматизатор журавлина','Барвник: Е133']::text[],156,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('gUbETzhdjuQIxb8wP3yk',(select id from public.categories where slug = 'dried-flowers'),'Геліхрізум сушений','product-gubetzhdjuqixb8wp3yk','Абсолютна стабільність форми та всесезонна універсальність. Сушений геліхрізум (безсмертник) — це маленькі, пружні суцвіття, що пройшли спеціалізовану дегідрацію, яка максимально зберігає їхню форму та яскравість природних відтінків (білий, жовтий, рожевий).

Слугує тонким, нейтральним акцентом у коктейлях та чаях, де важлива візуальна чистота. Геліхрізум не розмокає та не псує естетику коктейлів, слугуючи стабільним плаваючим акцентом. Додає тонкий, ледь трав''яний, сонячний аромат гарячим напоям та елітним чайним сумішам, не перебиваючи їх основний смак.
Оптимальне рішення для створення довговічних декоративних композицій (весільний декор, вітриністика, фотозони). У кондитерській справі використовується для акцентного, стабільного декору на тортах та для включення у карамель чи ізомальт завдяки його пружній структурі. Завдяки своїй витривалості, геліхрізум є незамінним елементом для універсального оформлення, ідеально вписуючись як у весняні, так і в осінні чи зимові композиції.

Ключові аспекти: висока структурна стійкість до вологи, ідеальний матеріал для довговічних декоративних композицій, елегантний, мінімалістичний вигляд.',195,null,true,true,true,false,'50шт','{}'::text[],157,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('gxy4WZ5u8FNSczf0YqUP',(select id from public.categories where slug = 'dried-flowers'),'Колоски декоративні Жовті','product-gxy4wz5u8fnsczf0yqup','Натуральна естетика та структурний акцент у декоративному оформленні. Ці добірні, висушені стебла (колоски) зі збереженою природною формою є стабільним, екологічним елементом для створення автентичних композицій.



У барній культурі можуть використовуватися для оригінального декору та надання напоям сезонного, теплого вайбу. Ідеально підходять для фотогенічних подач, простий засіб для додавання затишного, природного акценту.



Ключові аспекти: автентичний вигляд, стабільна суха структура, універсальність для створення тематичних композицій.',200,null,true,true,true,false,'50шт','{}'::text[],158,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('hj3okDAnvUucKA5Dyrpt',(select id from public.categories where slug = 'syrups'),'Полуниця ','product-hj3okdanvuucka5dyrpt','Сироп Полуниця Dream: Справжнє втілення чистого літа у кожній краплі. Ми вловили саму суть стиглої, зігрітої сонцем полуниці та перетворили її на оксамитовий, насичений сироп. Він дарує вибухову ягідну солодкість з ледь відчутною, освіжаючою кислинкою, наповнюючи ваші напої (коктейлі, лимонади, мілкшейки) ароматом свіжозібраних ягід та спокусливим яскраво-червоним кольором. Додайте Полуницю Dream — і смак сонця залишиться з вами у будь-яку пору року!',350,null,false,true,false,false,'1л',array['Цукор','вода','натуральний ароматизатор полуниці','барвник: Е133']::text[],159,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('i31YAc4cDL7hqvNwGh8W',(select id from public.categories where slug = 'dlia-kokteiliv'),'Dream Foam ','product-i31yac4cdl7hqvnwgh8w','Dream Foam – альтернатива використанню яєчного білка для приготування коктейлів з пишною, щільною і глянцевою пінкою. В основі Easyfoam - натуральний екстракт з кори вічнозеленого Квіллайа Сапонарія. Рослина багата сапонінами, поверхнево-активними речовинами, які і утворюють піну з самого коктейлю. Сапоніни містяться в багатьох рослинах і продуктах, які активно використовуються в харчовій промисловості, фармацевтиці та парфумерії. Easyfoam не містить алкоголю і глютену, підходить для веганів.

Склад: екстракт Quillaja saponaria, глюкозний сироп

Застосування: для приготування коктейлів з пишною пінкою (сауер, фізз та ін.) досить додати 2-4 краплі (0.2мл) в шейкер на один коктейль. Збити в шейкері з льодом і відцідити в келих. Для максимального ефекту збити без льоду до або після шейку з льодом, або за допомогою барміксера.

Термін придатності - 1 рік.

Зберігати при кімнатній температурі +5 +25°С  подалі від прямих променів сонячного світла.
',900,null,true,true,true,true,'100мл',array['Глюкозо']::text[],160,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('iSPyopY7MajIlxgXg6OM',(select id from public.categories where slug = 'chips'),'Бурякові чипси (кільця)','product-ispyopy7majilxgxg6om','Поєднання насиченого смаку, яскравого кольору та продуманої форми. Ці чіпси з натурального буряка — готове рішення для сучасної подачі. Багатогранний смак, в якому солодкуваті ноти буряка доповнені морською сіллю, поєднується з глибоким рубіновим кольором та функціональним дизайном.

Для професіоналів (Барна культура): універсальний інструмент, що вирішує одразу кілька задач: додає напою смакової складності, слугує яскравим візуальним акцентом та забезпечує акуратну, стабільну подачу на соломинці. Ідеальний для гастрономічних та savory-коктейлів.

Для домашнього використання (Гастрономія): дозволяє без зайвих зусиль створити подачу на професійному рівні. Один чіпс на соломинці миттєво перетворює домашній коктейль на щось особливе, дивуючи гостей продуманістю деталей.

Ключові аспекти: складний пряно-солоний смак, насичений природний колір та функціональна форма, розроблена для зручності та ефектної презентації.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',310,null,true,true,true,true,'100г',array['Буряк','морська сіль']::text[],161,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('jBs6woMe9RCE9YJTjGGq',(select id from public.categories where slug = 'dried-flowers'),'Бутони півонії сушені','product-jbs6wome9rce9yjtjggq','Структурна стійкість та концентрована розкіш для елітного оформлення. Сушені бутони півонії- це преміальний декоративний елемент, що пройшов делікатну дегідрацію для збереження великої, об''ємної форми та ніжного рожевого пігменту. Вони є висококласним фокусним елементом із тонким, елегантним квітковим ароматом.

Бутони півонії — це ідеальний центр уваги для вашого коктейлю, що забезпечує преміальну, об''ємну подачу.
Фокусний декор: завдяки великому розміру та об''ємній формі, бутон є самодостатнім елементом гарнішу для широких келихів (наприклад, коупів, сніфтерів або низьких роксів), надаючи напою урочистого та розкішного вигляду.
Незамінний інструмент для створення кришталево чистих сфер чи кубиків льоду. Бутон повністю зберігає свою форму в процесі заморожування, а його ніжний колір повільно вивільняється у напій під час танення.
Обов''язковий компонент для створення авторських квіткових блендів, де потрібна вишукана, але не домінуюча квіткова нота. Бутони повільно розкриваються у гарячій воді, вивільняючи делікатний, заспокійливий аромат, який ідеально доповнює чорний або зелений чай. Також використовується для делікатної ароматизації прозорих спиртів (джину, горілки) або цукрових сиропів, додаючи вишуканої, квіткової ноти без надмірної інтенсивності.

Висококласний гарніш для створення яскравих та унікальних композицій. Ідеально підходить для декорування багатоярусних тортів та інфузії прозорих спиртів для надання вишуканої ноти.

Ключові аспекти: тонкий, вишуканий аромат, ідеальна форма бутона, преміальний вигляд та висока функціональність як фокусного елемента.',160,null,true,true,true,false,'50г','{}'::text[],162,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('jGA2bMcysDKhLFZuOWK0',(select id from public.categories where slug = 'syrups'),'Гренадин','product-jga2bmcysdkhlfzuowk0','Сироп Гренадин Dream: Справжнє рубінове серце барної класики. Ми втілили багатство смаку стиглого граната та гармонійно доповнили його соковитими червоними ягодами. Цей густий сироп дарує напоям (коктейлям, лимонадам, смузі) не лише насичену терпкувато-солодку палітру, але й глибокий, магнетичний колір. Додайте Dream Гренадин — і ваші напої розквітнуть яскравістю та ягідною глибиною!',350,null,false,true,false,false,'1 л',array['Цукор','вода','натуральний ароматизатор вишні','граната','малини','смородини','черешні','барвник: Е133']::text[],163,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('jGZ45eCyfPfqb1A3UDAb',(select id from public.categories where slug = 'decorations'),'Скелетоване листя Білі','product-jgz45ecyfpfqb1a3udab','Елегантна витонченість та текстурна прозорість для преміального декору. Скелетоване листя- це делікатний матеріал, що пройшов спеціалізовану обробку для видалення м''якої тканини, залишаючи лише тонку мереживну сітку жилок. Вони забезпечують легкий, повітряний та вишуканий візуальний ефект.

Скелетоване листя є високохудожнім, невагомим елементом декору, що ідеально підходить для елітних подач. Листя забезпечує вишуканий, мереживний ефект у прозорих напоях. Його напівпрозора структура не закриває колір напою, а додає глибини та текстури.
Листя може використовуватися для створення колірного контрасту (наприклад, позолочене або срібне листя на темних напоях), підвищуючи драматизм подачі.
Ідеальний матеріал для включення у кубики льоду. Завдяки своїй делікатній структурі, листя створює витончену, "заморожену" композицію, що повільно тане, не вивільняючи кольору чи сильного смаку.
Ідеальний елемент для прикраси мусових тортів, желе, макаронів та цукерок. Листя може бути зафіксоване під прозорою глазур''ю або на шоколадних виробах, створюючи ефектний, крихкий вигляд.

Ключові аспекти: унікальна мереживна текстура, прозорий, повітряний вигляд, висока декоративна цінність для тонких робіт. Це делікатне, високоякісне та естетично впливове рішення для преміального, візуально орієнтованого бартендингу.',265,null,true,true,true,false,'50шт','{}'::text[],164,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('jsm10xzZAI53OngxLlcr',(select id from public.categories where slug = 'dried-flowers'),'Колоски декоративні Сірі','product-jsm10xzzai53ongxllcr','Натуральна естетика та структурний акцент у декоративному оформленні. Ці добірні, висушені стебла (колоски) зі збереженою природною формою є стабільним, екологічним елементом для створення автентичних композицій.



У барній культурі можуть використовуватися для оригінального декору та надання напоям сезонного, теплого вайбу. Ідеально підходять для фотогенічних подач, простий засіб для додавання затишного, природного акценту.



Ключові аспекти: автентичний вигляд, стабільна суха структура, універсальність для створення тематичних композицій.',200,null,true,true,true,false,'50шт','{}'::text[],165,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('k0gha4JoKKErVS0PWBT5',(select id from public.categories where slug = 'decorations'),'Лістя бамбуку','product-k0gha4jokkervs0pwbt5','Високофункціональний матеріал з витонченою геометричною формою та нативним трав''яним ароматом. Свіжий бамбуковий лист є унікальним,еластичним, насичено-зеленим елементом, незамінним для створення модерністських та екзотичних подач.

Вертикальний гарніш: довга, тонка форма листа ідеально підходить для вертикального оформлення високих келихів, додаючи напою візуальної висоти, свіжості та азійського шарму. Лист є достатньо гнучким, щоб його можна було скрутити або обернути навколо внутрішньої стінки келиха, створюючи чистий, насичено-зелений фон для напою.
Можна використовувати для інфузії прозорих спиртів або сиропів, надаючи їм яскравого, трав''яного, "зеленого" профілю, який чудово поєднується з ромом, текілою та східними лікерами.
Легке зминання листа перед подачею вивільняє яскравий, свіжий, трав''яний аромат, який доповнює ароматичний букет коктейлю.
Естетичний фон для сервірування холодних закусок, суші, сашимі та інших страв. Його яскравий колір та витончена форма додають презентації візуальної свіжості та автентичного азійського колориту.

Ключові аспекти:  яскравий, стійкий колір, автентична трав''яна ароматика, оригінальне, свіже та структурно гнучке рішення для екзотичної та елегантної подачі.',270,null,true,true,true,false,'100шт',array['лістя бамбуку']::text[],166,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('kmDce3pneiEwva3zv79T',(select id from public.categories where slug = 'chips'),'чипси Полуниці','product-kmdce3pneiewva3zv79t','Смак стиглої літньої полуниці, доступний цілий рік. Наші чіпси створені з добірних, солодких ягід, що проходять дбайливу дегідрацію. Цей процес дозволяє зберегти насичений рубіновий колір, концентрований солодкий аромат та впізнаваний смак свіжої полуниці в кожному хрусткому слайсі.

Для професіоналів (Барна культура): елегантний та ароматний гарніш, що ідеально пасує до коктейлів з ігристим вином, джином та горілкою. Чудово доповнює полуничні варіації класичних коктейлів, як-от Daiquiri чи Margarita, додаючи не лише візуальний акцент, але й інтенсивний ягідний аромат.

Для домашнього вжитку (Гастрономія): використовуйте як яскраву та смачну прикрасу для тортів, морозива та молочних шейків. Це також чудовий легкий снек.

Ключові аспекти: концентрований смак та аромат справжньої полуниці, насичений червоний колір для ефектних подач, неймовірна універсальність — від сніданку до вишуканого коктейлю.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',315,null,true,true,true,false,'100г',array['Полуниця 100%']::text[],167,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('l1EFFwI0Pz2q6wSRkYRd',(select id from public.categories where slug = 'chips'),'Кокосові чипси ','product-l1effwi0pz2q6wsrkyrd','Кокосові чипси- це елегантний акцент, який здатен миттєво преобразити ваші улюблені коктейлі та напої. Вони не лише забезпечують естетичну привабливість, а й збагачують вміст келиха натуральним ароматом і насиченим смаком.

Кожна тонка скибочка кокоса слугує вишуканим міні-шедевром, що надає вашому напою унікального смаку та неперевершеного вигляду. Ці чипси створюються з добірних, найсвіжіших плодів, завдяки чому їхня природна смакова та ароматична інтенсивність залишається максимально збереженою. Це декорування — ваш ключ до творчої свободи у міксології, що дозволяє перетворити рядовий напій на справжній феєрверк ідей.

Для професіоналів (Барна культура): абсолютний must-have для тікі-бару. Незамінний гарніш для Piña Colada та інших тропічних коктейлів. Подрібнені чіпси створюють ідеальний та ароматний обідок для келиха, а цілісні пелюстки додають текстури та автентичного вигляду напоям.

Для домашнього вжитку (Гастрономія): смачний та поживний снек, а також ідеальний топінг для смузі-боулів, граноли та азійських страв. Прикрашайте ними випічку та десерти, щоб додати їм хрусткої текстури та ніжного кокосового смаку.

Ключові аспекти: автентичний тропічний смак кокоса, неймовірно легка та хрустка текстура, універсальність у використанні — від солодких до солоних страв та різноманітних коктейлів.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',210,null,true,true,true,true,'100г',array['Кокос','глюкозний сироп','сік лимона']::text[],168,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('lVNXQYwVvysJShmCwmLG',(select id from public.categories where slug = 'dried-flowers'),'Колоски декоративні Коричневі','product-lvnxqywvvysjshmcwmlg','Натуральна естетика та структурний акцент у декоративному оформленні. Ці добірні, висушені стебла (колоски) зі збереженою природною формою є стабільним, екологічним елементом для створення автентичних композицій.



У барній культурі можуть використовуватися для оригінального декору та надання напоям сезонного, теплого вайбу. Ідеально підходять для фотогенічних подач, простий засіб для додавання затишного, природного акценту.



Ключові аспекти: автентичний вигляд, стабільна суха структура, універсальність для створення тематичних композицій.',200,null,true,true,true,false,'50шт','{}'::text[],169,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('mD2DrA6LP4Hp7D4HLjdy',(select id from public.categories where slug = 'dried-flowers'),'гортензія Рожева','product-md2dra6lp4hp7d4hljdy','Естетична універсальність та багата кольорова палітра для вишуканого декору. Цей контрастний мікс являє собою поєднання натуральних відтінків (від ніжного рожевого до глибокого блакитного, фіолетового та кремового).



Ексклюзивний плаваючий гарніш для надання напоям вишуканої естетики. Завдяки своїй мінімальній вазі, пелюстки елегантно утримуються на поверхні келиха, для створення фотогенічних напоїв. Ідеальний для формування візуально складних та яскравих подач. Також слугує унікальним елементом для заморожування у кубиках льоду, що створює повільний та естетичний декор.

Високохудожній інструмент для фінального оформлення. Мікс ідеально підходить для елітної кондитерської лінії та гастрономічної подачі, де потрібен тонкий, естетичний акцент на тарілці. Забезпечує стабільний, тривалий візуальний ефект.



Ключові аспекти: широка гама природних кольорів, надзвичайно легка, повітряна текстура, довговічна естетика, безпечний, натуральний декоративний матеріал з високою фотогенічністю.',175,null,true,true,true,false,'8-10г','{}'::text[],170,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('mNdgLu0M4GMPFGwZRe7C',(select id from public.categories where slug = 'decorations'),'Коктейльний цукор Зелений','product-mndglu0m4gmpfgwzre7c','Спеціалізована цукрова суміш для професійного оформлення обідка келиха (rimming). Цей продукт вирізняється стандартизованою фракцією (розміром кристалів), що забезпечує ідеальне прилипання та рівномірне покриття. Доступний у різних кольорах.

Цукор створює акуратний, візуально привабливий обідок для класичних та авторських коктейлів (Margarita, Cosmopolitan, Lemon Drop). Спеціальна текстура запобігає надмірному розсипанню та полегшує процес декорування.
Різні кольори цукру можуть слугувати для маркування напоїв або дотримання фірмового стилю закладу. Яскравий колір миттєво привертає увагу.

Ключові аспекти: стандартизована фракція для rimming, швидкість та легкість застосування, візуальний та смаковий контраст, підвищення якості презентації.',85,null,true,true,true,false,'70г','{}'::text[],171,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('mW41jeIHIIx0PvHzEBZ1',(select id from public.categories where slug = 'chips'),'Ананасові чипси (смужки)','product-mw41jeihiix0pvhzebz1','Екзотична розкіш у стильній формі. Наші ананасові чипси у вигляді елегантних смужок — це смак стиглого, сонячного ананаса, збережений завдяки дбайливій дегідрації. Кожна смужка має насичений золотистий колір та концентрований тропічний аромат, що миттєво переносить у атмосферу далеких островів.

Для професіоналів (Барна культура): це ідеальний сучасний гарніш для тікі-коктейлів, зокрема Mai Tai або Piña Colada. Подовжена форма дозволяє ефектно прикрасити як високі, так і низькі келихи, додаючи напою вишуканості та впізнаваного тропічного смаку. Чудово поєднується з ромом, кокосом та цитрусовими.

Для домашнього вжитку (Гастрономія): насолоджуйтесь ними як 100% натуральним та корисним снеком, що замінить традиційні солодощі. Додавайте смужки до ранкової граноли, йогурту або використовуйте для декорування тортів та домашніх десертів, надаючи їм ресторанного вигляду.

Ключові аспекти: яскраво виражений солодкий смак натурального ананаса, незвичайна та зручна форма для декору, повна відсутність домішок та універсальність у використанні — від напоїв до здорових перекусів.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',410,null,true,true,true,true,'100г',array['Ананас','глюкозний сироп']::text[],172,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('nIMWxwvxi4tTG3UJwYZY',(select id from public.categories where slug = 'decorations'),'Ізомальт червоний','product-nimwxwvxi4ttg3ujwyzy','Технологічна основа для структурного, геометричного декору з ефектом кришталевої прозорості. Цей преміальний підсолоджувач забезпечує виняткову стійкість форми, ідеально підходячи для створення довговічних, нелипких прикрас.

Діаметр 3мм.





Ізомальт використовується для створення індивідуальних, прозорих прикрас, що розміщуються на обідку або поверхні напою. Його стійкість до вологи гарантує, що гарніш не стане липким і не потече від охолодження.

Можна застосовувати як тримач для ароматичних масел, які використовуються для ароматної активації перед вживанням коктейлю.

Для створення тонкого, прозорого обідка (rimming), який не кристалізується і не мутніє, як звичайний цукор. Це додає преміального блиску келиху.



Ключові аспекти: кришталева прозорість, стійкість до вологи та кристалізації, низький ризик карамелізації  роблять Ізомальт незамінним для інноваційного та преміального барного декору.',200,null,true,true,true,false,'40шт','{}'::text[],173,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('ndRzYSqq9zLXq3Wfig8v',(select id from public.categories where slug = 'spicer'),'Набір подарунковий Для неї','product-ndrzysqq9zlxq3wfig8v','',599,null,false,true,true,false,'250 мл','{}'::text[],174,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('nmdeF8PoAcgs2DPQSl3r',(select id from public.categories where slug = 'spicer'),'Набір подарунковий Для нього','product-nmdef8poacgs2dpqsl3r','',599,null,false,true,true,false,'250 мл','{}'::text[],175,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('nzrLfv6PCdEDKycAXgqv',(select id from public.categories where slug = 'spicer'),'SPICY CITRUS (Цитрусово-імбирний спайсер)','product-nzrlfv6pcdedkycaxgqv','',105,null,false,true,true,false,'50 мл, 500 мл, 700 мл','{}'::text[],176,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('o4328ZNPoqWLeWlBE25s',(select id from public.categories where slug = 'spicer'),'APPLE DISTILL (Яблучний бренді)','product-o4328znpoqwlewlbe25s','',920,null,false,true,true,false,'700 мл','{}'::text[],177,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('oJNTvyomvMJWmC7dnHtP',(select id from public.categories where slug = 'dried-flowers'),'Колоски декоративні Сині','product-ojntvyomvmjwmc7dnhtp','Натуральна естетика та структурний акцент у декоративному оформленні. Ці добірні, висушені стебла (колоски) зі збереженою природною формою є стабільним, екологічним елементом для створення автентичних композицій.



У барній культурі можуть використовуватися для оригінального декору та надання напоям сезонного, теплого вайбу. Ідеально підходять для фотогенічних подач, простий засіб для додавання затишного, природного акценту.



Ключові аспекти: автентичний вигляд, стабільна суха структура, універсальність для створення тематичних композицій.',200,null,true,true,true,false,'50шт','{}'::text[],178,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('plFRjpVbS3yfCzuVB12g',(select id from public.categories where slug = 'dried-flowers'),'Колоски декоративні Рожеві','product-plfrjpvbs3yfczuvb12g','Натуральна естетика та структурний акцент у декоративному оформленні. Ці добірні, висушені стебла (колоски) зі збереженою природною формою є стабільним, екологічним елементом для створення автентичних композицій.



У барній культурі можуть використовуватися для оригінального декору та надання напоям сезонного, теплого вайбу. Ідеально підходять для фотогенічних подач, простий засіб для додавання затишного, природного акценту.



Ключові аспекти: автентичний вигляд, стабільна суха структура, універсальність для створення тематичних композицій.',200,null,true,true,true,false,'50шт','{}'::text[],179,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('qEjWfvoqdtBXI5nMymZT',(select id from public.categories where slug = 'spicer'),'Набір подарунковий Солодкий','product-qejwfvoqdtbxi5nmymzt','',939,null,false,true,true,false,'500 мл','{}'::text[],180,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('qecXI5e5HyXycS6eztjh',(select id from public.categories where slug = 'spicer'),'APRICOT DISTILL (Абрикосове бренді)','product-qecxi5e5hyxycs6eztjh','',780,null,false,true,true,false,'500 мл','{}'::text[],181,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('qruzV6tA18NmLMuluBxC',(select id from public.categories where slug = 'spicer'),'OPIUM (Маковий спайсер)','product-qruzv6ta18nmlmulubxc','',850,null,false,true,true,false,'500 мл','{}'::text[],182,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('qtgXbcKnKLMI1KHg4ZHg',(select id from public.categories where slug = 'decorations'),'Ізомальт жовтий','product-qtgxbcknklmi1khg4zhg','Технологічна основа для структурного, геометричного декору з ефектом кришталевої прозорості. Цей преміальний підсолоджувач забезпечує виняткову стійкість форми, ідеально підходячи для створення довговічних, нелипких прикрас.

Діаметр 3мм.





Ізомальт використовується для створення індивідуальних, прозорих прикрас, що розміщуються на обідку або поверхні напою. Його стійкість до вологи гарантує, що гарніш не стане липким і не потече від охолодження.

Можна застосовувати як тримач для ароматичних масел, які використовуються для ароматної активації перед вживанням коктейлю.

Для створення тонкого, прозорого обідка (rimming), який не кристалізується і не мутніє, як звичайний цукор. Це додає преміального блиску келиху.



Ключові аспекти: кришталева прозорість, стійкість до вологи та кристалізації, низький ризик карамелізації  роблять Ізомальт незамінним для інноваційного та преміального барного декору.',200,null,true,true,true,false,'40шт','{}'::text[],183,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('rBUjQw1rYQxHBfJ0cxhw',(select id from public.categories where slug = 'decorations'),'Повітряний рис в білому шоколаді (Бронза)','product-rbujqw1ryqxhbfj0cxhw','Високоякісний, хрусткий топінг із дзеркальним, металевим фінішем. Легкий повітряний рис, покритий тонким шаром білого шоколаду, а потім оброблений їстівним бронзовим пігментом, забезпечує інтенсивний блиск та елітний візуальний ефект. Діаметр 3мм.

Незамінний акцент для напоїв з вершковим, пінним або лікерним шаром. Частинки стабільно утримуються на поверхні, додаючи аудіального (хрусткого) та візуального контрасту.
Може бути використаний у невеликій кількості для оздоблення поверхні шотів або посипання їстівних елементів гарнішу (наприклад, шоколадних слайсів чи фруктів).

Ідеально підходить для створення текстурного шару на мусових тортах, тістечках та десертах. Частинки стабільно тримаються та забезпечують тривалий хруст без розмокання.

Ключові аспекти: стабільна текстура, розкішний бронзовий блиск та унікальний хруст для підвищення рівня барного сервісу.',100,null,true,true,true,false,'50г',array['білий шоколад (56%)','білий цукровий наповнювач (26%)','хрусткий рис (17%)','кандурин']::text[],184,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('rmdY0lrv9NbfCB1iuqt5',(select id from public.categories where slug = 'spicer'),'Набір подарунковий Для неї LOVE','product-rmdy0lrv9nbfcb1iuqt5','',790,null,false,true,true,false,null,'{}'::text[],185,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('rx1o4UYsCu1cXJxsKVwO',(select id from public.categories where slug = 'decorations'),'Ізомальт пурпурний','product-rx1o4uyscu1cxjxskvwo','Технологічна основа для структурного, геометричного декору з ефектом кришталевої прозорості. Цей преміальний підсолоджувач забезпечує виняткову стійкість форми, ідеально підходячи для створення довговічних, нелипких прикрас.

Діаметр 3мм.





Ізомальт використовується для створення індивідуальних, прозорих прикрас, що розміщуються на обідку або поверхні напою. Його стійкість до вологи гарантує, що гарніш не стане липким і не потече від охолодження.

Можна застосовувати як тримач для ароматичних масел, які використовуються для ароматної активації перед вживанням коктейлю.

Для створення тонкого, прозорого обідка (rimming), який не кристалізується і не мутніє, як звичайний цукор. Це додає преміального блиску келиху.



Ключові аспекти: кришталева прозорість, стійкість до вологи та кристалізації, низький ризик карамелізації  роблять Ізомальт незамінним для інноваційного та преміального барного декору.',200,null,true,true,true,false,'40шт','{}'::text[],186,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('rzzE1rmuMuvq1mPxkixW',(select id from public.categories where slug = 'dried-flowers'),'Гомфрена сушена','product-rzze1rmumuvq1mpxkixw','Екзотична елегантність та структурна цілісність для преміальних проектів. Ці мініатюрні бутони мають стійку сферичну форму та глибокий, незмінний пурпуровий пігмент, що гарантує довготривалий візуальний ефект без втрати якості.

Забезпечує яскравий, контрастний акцент у прозорих напоях, що миттєво підвищує фотогенічність та візуал подачі. Ідеально підходить для акцентованого декорування обідка келиха (якщо подрібнити) або для точкового фінішу коктейлів у стилі сауер, демонструючи високу увагу до деталей.
Незамінний інструмент для ювелірного декорування десертів. Завдяки своїй стабільній формі та невеликому розміру, бутони ідеально підходять для створення чітких візерунків на глазурі, кремах, а також для прикраси макаронів, трюфелів та порційних десертів. Гарантує візуальну чистоту, оскільки не розчиняється та не вицвітає при контакті з рідиною.

Ключові аспекти: ідеальна геометрія, висока стійкість кольору, універсальність для деталізованого декорування. Це надійне, довговічне та високоестетичне рішення, що забезпечує стабільну якість гарнішу, скорочуючи час на підготовку.',190,null,true,true,true,false,'50г (75-100шт)','{}'::text[],187,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('t4WMkxwJE27nC3cKEZge',(select id from public.categories where slug = 'decorations'),'Скелетоване листя Фіолетові','product-t4wmkxwje27nc3ckezge','Елегантна витонченість та текстурна прозорість для преміального декору. Скелетоване листя- це делікатний матеріал, що пройшов спеціалізовану обробку для видалення м''якої тканини, залишаючи лише тонку мереживну сітку жилок. Вони забезпечують легкий, повітряний та вишуканий візуальний ефект.



Скелетоване листя є високохудожнім, невагомим елементом декору, що ідеально підходить для елітних подач. Листя забезпечує вишуканий, мереживний ефект у прозорих напоях. Його напівпрозора структура не закриває колір напою, а додає глибини та текстури.

Листя може використовуватися для створення колірного контрасту (наприклад, позолочене або срібне листя на темних напоях), підвищуючи драматизм подачі.

Ідеальний матеріал для включення у кубики льоду. Завдяки своїй делікатній структурі, листя створює витончену, "заморожену" композицію, що повільно тане, не вивільняючи кольору чи сильного смаку.

Ідеальний елемент для прикраси мусових тортів, желе, макаронів та цукерок. Листя може бути зафіксоване під прозорою глазур''ю або на шоколадних виробах, створюючи ефектний, крихкий вигляд.



Ключові аспекти: унікальна мереживна текстура, прозорий, повітряний вигляд, висока декоративна цінність для тонких робіт. Це делікатне, високоякісне та естетично впливове рішення для преміального, візуально орієнтованого бартендингу.',265,null,true,true,true,false,'50шт','{}'::text[],188,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('tOQhPrrAhsRAsz1sPkXk',(select id from public.categories where slug = 'decorations'),'Скелетоване листя Блакитні','product-toqhprrahsrasz1spkxk','Елегантна витонченість та текстурна прозорість для преміального декору. Скелетоване листя- це делікатний матеріал, що пройшов спеціалізовану обробку для видалення м''якої тканини, залишаючи лише тонку мереживну сітку жилок. Вони забезпечують легкий, повітряний та вишуканий візуальний ефект.



Скелетоване листя є високохудожнім, невагомим елементом декору, що ідеально підходить для елітних подач. Листя забезпечує вишуканий, мереживний ефект у прозорих напоях. Його напівпрозора структура не закриває колір напою, а додає глибини та текстури.

Листя може використовуватися для створення колірного контрасту (наприклад, позолочене або срібне листя на темних напоях), підвищуючи драматизм подачі.

Ідеальний матеріал для включення у кубики льоду. Завдяки своїй делікатній структурі, листя створює витончену, "заморожену" композицію, що повільно тане, не вивільняючи кольору чи сильного смаку.

Ідеальний елемент для прикраси мусових тортів, желе, макаронів та цукерок. Листя може бути зафіксоване під прозорою глазур''ю або на шоколадних виробах, створюючи ефектний, крихкий вигляд.



Ключові аспекти: унікальна мереживна текстура, прозорий, повітряний вигляд, висока декоративна цінність для тонких робіт. Це делікатне, високоякісне та естетично впливове рішення для преміального, візуально орієнтованого бартендингу.',265,null,true,true,true,false,'50шт','{}'::text[],189,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('uaJQeMvMaPMGskh3nqHv',(select id from public.categories where slug = 'dried-flowers'),'Колоски декоративні Бірюзові','product-uajqemvmapmgskh3nqhv','Натуральна естетика та структурний акцент у декоративному оформленні. Ці добірні, висушені стебла (колоски) зі збереженою природною формою є стабільним, екологічним елементом для створення автентичних композицій.



У барній культурі можуть використовуватися для оригінального декору та надання напоям сезонного, теплого вайбу. Ідеально підходять для фотогенічних подач, простий засіб для додавання затишного, природного акценту.



Ключові аспекти: автентичний вигляд, стабільна суха структура, універсальність для створення тематичних композицій.',200,null,true,true,true,false,'50шт','{}'::text[],190,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('umxXduEdnFYQZFamPVQa',(select id from public.categories where slug = 'spicer'),'Набір подарунковий Ексклюзивний','product-umxxduednfyqzfampvqa','',639,null,false,true,true,false,'250 мл','{}'::text[],191,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('upNOmjQ8nM6sx9rUDkkT',(select id from public.categories where slug = 'dried-flowers'),'Гортензія Бірюзова','product-upnomjq8nm6sx9rudkkt','Естетична універсальність та багата кольорова палітра для вишуканого декору. Цей контрастний мікс являє собою поєднання натуральних відтінків (від ніжного рожевого до глибокого блакитного, фіолетового та кремового).



Ексклюзивний плаваючий гарніш для надання напоям вишуканої естетики. Завдяки своїй мінімальній вазі, пелюстки елегантно утримуються на поверхні келиха, для створення фотогенічних напоїв. Ідеальний для формування візуально складних та яскравих подач. Також слугує унікальним елементом для заморожування у кубиках льоду, що створює повільний та естетичний декор.

Високохудожній інструмент для фінального оформлення. Мікс ідеально підходить для елітної кондитерської лінії та гастрономічної подачі, де потрібен тонкий, естетичний акцент на тарілці. Забезпечує стабільний, тривалий візуальний ефект.



Ключові аспекти: широка гама природних кольорів, надзвичайно легка, повітряна текстура, довговічна естетика, безпечний, натуральний декоративний матеріал з високою фотогенічністю.',175,null,true,true,true,false,'8-10г','{}'::text[],192,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('v6tFhkP0AywDc72LrjGw',(select id from public.categories where slug = 'spicer'),'Набір подарунковий Для неї LOVE','product-v6tfhkp0aywdc72lrjgw','',790,null,false,true,true,false,null,'{}'::text[],193,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('v8IjqpAxkJkVymClccgO',(select id from public.categories where slug = 'dried-flowers'),'Бутони чайної троянди (темна)','product-v8ijqpaxkjkvymclccgo','Розкішний аромат та глибокий колір у кожному бутоні. Сушені бутони темної чайної троянди- це преміальний декоративний інгредієнт. Завдяки спеціалізованій дегідрації, бутони зберігають свій інтенсивний, оксамитовий відтінок та концентрований, складний трояндовий аромат.

Бутони темної троянди- це ультимативний преміум-гарніш для створення сенсорної розкоші у напоях. Драматичний візуальний акцент: темна троянда ідеально контрастує зі світлими рідинами — шампанським, Просекко або прозорими дистилятами (джином, горілкою), що миттєво надає напою вишуканого шарму та неповторного вигляду.
Завдяки закритій формі, бутон не розпадається у рідині та є ідеальним елементом для заморожування у кришталево чистих кубиках льоду, які повільно вивільняють колір та аромат під час танення.
Якщо бутони троянди подрібнити, вони стануть унікальною, ароматною пудрою для оформлення обідка келиха (рімінг), ідеально поєднуючись із цукром або сіллю, та слугують фінішним акцентом на кремових топінгах.
Обов''язковий компонент для створення вишуканих чайних блендів. Бутони повільно виділяють свій насичений, солодкуватий аромат, збагачуючи смак чорного та зеленого чаю.
У кондитерській справі використовується цілим для оздоблення десертів або для інфузії сиропів, що надає напоям глибокого, квіткового профілю.

Ключові аспекти: інтенсивний, оксамитовий колір, концентрований, складний трояндовий аромат, преміальний вигляд для декору та інфузії. Це надійне та елегантне рішення, що забезпечує вишукану подачу.',200,null,true,true,true,false,'50г','{}'::text[],194,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('vROLkRi3vnz79yULqTet',(select id from public.categories where slug = 'spicer'),'Набір подарунковий SPOGAD 23','product-vrolkri3vnz79yulqtet','',599,null,false,true,true,false,'250 мл','{}'::text[],195,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('vlTf2Vi0TndsHIsJ483B',(select id from public.categories where slug = 'spicer'),'Набір подарунковий Кавовий','product-vltf2vi0tndshisj483b','',599,null,false,true,true,false,'250 мл','{}'::text[],196,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('xCaZtmiQr51dphhvvNeH',(select id from public.categories where slug = 'spicer'),'Набір подарунковий Для неї LOVE','product-xcaztmiqr51dphhvvneh','',790,null,false,true,true,false,null,'{}'::text[],197,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('xaix3ecMTFBWUycl0EaI',(select id from public.categories where slug = 'chips'),'чипси Хурми','product-xaix3ecmtfbwuycl0eai','Ідеальний партнер для витриманих спиртних напоїв. Солодкий, медово-пряний профіль цих чіпсів з хурми створений, щоб доповнювати віскі, бренді та темний ром. Ми досягаємо такої глибини смаку шляхом повільної дегідрації добірних, нетерпких плодів, перетворюючи їх на красиві бурштинові слайси.

Для професіоналів (Барна культура): вишуканий сезонний гарніш для авторських коктейлів. Ідеально поєднується з витриманими спиртами: віскі, бренді, темним ромом та пряними лікерами. Його теплий смак та колір чудово доповнять зігріваючі осінні та зимові напої.

Для домашнього вжитку (Гастрономія): насолоджуйтесь ними як самостійним десертом або вишуканим снеком. Це чудове доповнення до сирної тарілки, особливо до м''яких та вершкових сирів. Використовуйте для прикрашання ранкової каші, йогуртів та сезонної випічки.

Ключові аспекти: унікальний медово-пряний смак, насичений бурштиновий колір. Ідеальний вибір для створення затишної та святкової атмосфери.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',285,null,true,true,true,false,'100г',array['Хурма','глюкозний сироп']::text[],198,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('xyo4uFbXK3PiRAyJMff4',(select id from public.categories where slug = 'chips'),'Імбирні чипси (смужки)','product-xyo4ufbxk3pirayjmff4','Концентрована пряність, потужний ароматичний акцент та зігріваюча енергія в кожному слайсі. Наші імбирні чіпси створені зі свіжого, соковитого кореня імбиру, який після делікатної обробки та повільної дегідрації перетворюється на хрусткі, напівпрозорі пластинки. Вони зберігають свій характерний гострий смак з лимонними нотками та інтенсивний, теплий аромат.

Для професіоналів (Барна культура): потужний інструмент для створення виразних коктейлів. Ідеальний гарніш для Penicillin та будь-яких напоїв на основі віскі чи темного рому. Додає не лише естетики, але й відчутної пряної гостроти, що стимулює рецептори та збагачує смаковий профіль напою.

Для домашнього вжитку (Гастрономія): незамінний інгредієнт для зігріваючого чаю в холодну пору. Подрібніть чіпси та додайте до випічки (печива, кексів) для надання їй пікантної нотки. Чудово доповнює страви, маринади для м''яса та риби.

Ключові аспекти: яскраво виражений, гострий та пряний смак, сильний зігріваючий аромат, універсальність у застосуванні — від коктейлів до кулінарії та оздоровчих напоїв.

У нашому асортименті представлено безліч різноманітних гарнішів, щоб задовольнити будь-які індивідуальні потреби. Створюйте бездоганні напої легко та швидко, підвищуючи свою майстерність разом із Dream!',390,null,true,true,true,false,'100г',array['Імбир','глюкозний сироп']::text[],199,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('yXAQnl1unNeHuxXoTLPl',(select id from public.categories where slug = 'syrups'),'Гранат','product-yxaqnl1unnehuxxotlpl','Сироп "Гранат" від Dream: Яскравий, насичений смак південних гранатів у кожній краплі. Насолода з легкою, освіжаючою терпкістю, що перетворює звичайний напій чи десерт на справжній шедевр. Ідеально підходить для коктейлів, лимонадів та кавових напоїв. Відчуйте справжній смаковий вибух!',350,null,false,true,false,false,'1 л',array['Цукор','вода','концентрат граната','барвник: Е133']::text[],200,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('ymAYgnoXQWavForOeVFC',(select id from public.categories where slug = 'spicer'),'GRAPE DISTILL (Виноградне бренді)','product-ymaygnoxqwavforoevfc','',105,null,false,true,true,false,'50 мл','{}'::text[],201,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)
values ('yzjwWvvIGzQDeACBwmg1',(select id from public.categories where slug = 'decorations'),'Коктейльний цукор Блакитний','product-yzjwwvvigzqdeacbwmg1','Спеціалізована цукрова суміш для професійного оформлення обідка келиха (rimming). Цей продукт вирізняється стандартизованою фракцією (розміром кристалів), що забезпечує ідеальне прилипання та рівномірне покриття. Доступний у різних кольорах.

Цукор створює акуратний, візуально привабливий обідок для класичних та авторських коктейлів (Margarita, Cosmopolitan, Lemon Drop). Спеціальна текстура запобігає надмірному розсипанню та полегшує процес декорування.
Різні кольори цукру можуть слугувати для маркування напоїв або дотримання фірмового стилю закладу. Яскравий колір миттєво привертає увагу.

Ключові аспекти: стандартизована фракція для rimming, швидкість та легкість застосування, візуальний та смаковий контраст, підвищення якості презентації.',85,null,true,true,true,false,'70г','{}'::text[],202,null)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price = excluded.price, original_price = excluded.original_price,
  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,
  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,
  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;

commit;
