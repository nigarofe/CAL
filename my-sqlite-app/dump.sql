BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "attempts" (
	"id"	INTEGER,
	"question_number"	INTEGER NOT NULL,
	"code"	INTEGER NOT NULL,
	"attempt_datetime"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("question_number") REFERENCES "questions"("question_number") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "questions" (
	"question_number"	INTEGER,
	"discipline"	TEXT NOT NULL,
	"source"	TEXT NOT NULL,
	"description"	TEXT NOT NULL,
	PRIMARY KEY("question_number" AUTOINCREMENT)
);
INSERT INTO "attempts" VALUES (1,1,1,'2025-05-26 14:37:42');
INSERT INTO "attempts" VALUES (2,1,1,'2025-05-26 14:44:43');
INSERT INTO "attempts" VALUES (3,1,2,'2025-05-26 14:44:47');
INSERT INTO "attempts" VALUES (4,2,1,'2025-05-26 14:44:53');
INSERT INTO "attempts" VALUES (6,1,1,'2025-05-26 14:46:13');
INSERT INTO "attempts" VALUES (7,2,4,'2025-05-26 14:46:18');
INSERT INTO "attempts" VALUES (8,1,8,'2025-05-26 14:53:58');
INSERT INTO "questions" VALUES (1,'first','avocado','banaan');
INSERT INTO "questions" VALUES (2,'qwdijw','awi','aw');
COMMIT;
