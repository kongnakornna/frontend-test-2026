# Frontend Test 2026 🚀

> Frontend Developer Challenge

ยินดีต้อนรับสู่ **Frontend Test 2026**! โปรเจกต์นี้เป็นข้อสอบสำหรับการคัดเลือก Frontend Developer ซึ่งจะจำลองการพัฒนาแอปพลิเคชันจริงโดยเน้นเรื่อง Architecture, State Management, Validation และการทำ User Interface

> ในปัจจุบันโปรเจกต์จะประกอบไปด้วยการทดสอบหลัก ได้แก่ The Feature Flag Editor

## 🛠 Tech Stack

โปรเจกต์นี้ถูกเซ็ตอัปพื้นฐานด้วยเทคโนโลยีสมัยใหม่ เพื่อประสบการณ์การพัฒนาที่รวดเร็วและเป็นมาตรฐาน:

- **Framework:** React 19 + [@tanstack/react-start](https://tanstack.com/start/latest)
- **Routing:** [@tanstack/react-router](https://tanstack.com/router/latest)
- **Form Management:** [@tanstack/react-form](https://tanstack.com/form/latest)
- **Validation:** [Zod](https://zod.dev/)
- **Code Editor / JSON Preview:** [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
- **Styling:** Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Testing:** [Vitest](https://vitest.dev/)

## 🚀 Getting Started

กรุณาทำตามขั้นตอนด้านล่างเพื่อเริ่มการทดสอบ:

### 1. การติดตั้ง (Installation)

โปรเจกต์นี้ใช้ `pnpm` เป็น Package Manager (หากคุณยังไม่มีสามารถติดตั้งได้ด้วย `npm install -g pnpm`)

```bash
pnpm install
```

### 2. รันรันโปรเจกต์สำหรับการพัฒนา (Development)

```bash
pnpm dev
```

หลังจากรันคำสั่ง โปรเจกต์จะสามารถเข้าถึงได้ผ่าน `http://localhost:3000`

### 3. ส่วนของการทดสอบ (Challenge)

เมื่อเปิดโปรเจกต์ขึ้นมาบน Browser คุณจะพบกับหน้า **Assignment Dashboard**

- ให้กดเข้าไปที่ส่วนของโจทย์การทดสอบ **Feature Flag Editor**
- โค้ดสำหรับการทดสอบของคุณจะเริ่มต้นให้เขียนได้ที่ไฟล์ `/src/pages/code-challenge/feature-flag-form/your-codes/index.tsx`
- คุณสามารถดูรายละเอียดของโจทย์ได้ที่ไฟล์ `/src/pages/code-challenge/feature-flag-form/README.md`

## 📝 Scripts

คุณสามารถใช้คำสั่งพื้นฐานเหล่านี้ในระหว่างการพัฒนาได้:

- `pnpm dev`: เริ่มต้น Development Server ที่ Port 3000
- `pnpm build`: บิวด์โปรเจกต์สำหรับ Production
- `pnpm preview`: จำลอง Production environment หลังจาก Build
- `pnpm test`: รัน Unit Tests ด้วย Vitest
- `pnpm format`: จัด Format โค้ดของคุณด้วย Prettier
- `pnpm lint`: ตรวจสอบความถูกต้องของโค้ดด้วย ESLint
- `pnpm check`: จัด Format โค้ดและแก้ไข Lint รวดเดียว

## 🎯 กฎและกติกา (Rules & Guidelines)

1. **อ่านข้อกำหนดของแต่ละโจทย์ (Requirements) ให้ชัดเจน:** คุณสามารถดูเงื่อนไข และฟีเจอร์ที่ต้องมีได้ในหน้าโจทย์แต่ละข้อ
2. **ใช้ Tools ที่กำหนด:** กรุณาใช้เครื่องมือที่กำหนดใน Requirements เช่น `@tanstack/react-form` และ `zod`
3. **จัดระเบียบโค้ดให้สวยงามและอ่านง่าย:** คำนึงถึงการแบ่ง Components, Naming Conventions, และ Performance ตามมาตรฐานของ Senior Developer
4. **ความสมบูรณ์แบบของ UI/UX:** เนื่องจากโจทย์เป็นการจำลองระบบจริง ให้ทำ UI/UX ออกมาให้ดีและใช้ประโยชน์จาก Tailwind CSS ให้ได้มากที่สุด

# คู่มือการใช้งาน Feature Flag Editor

คู่มือนี้อธิบายการใช้งานหน้า **Feature Flag Editor** ทุกส่วน ตั้งแต่การเปิดโปรแกรม การกรอกแต่ละฟิลด์ การสร้างเงื่อนไข
Targeting การอ่านข้อความ Error ไปจนถึงรูปแบบ JSON ที่ได้ ท้ายเอกสารมีส่วนสำหรับนักพัฒนาที่ต้องการแก้ไขหรือต่อยอดโค้ด

---

## สารบัญ

1. [ภาพรวม](#1-ภาพรวม)
2. [การเริ่มต้นใช้งาน](#2-การเริ่มต้นใช้งาน)
3. [ส่วนประกอบของหน้าจอ](#3-ส่วนประกอบของหน้าจอ)
4. [ธีม: สว่าง / มืด](#4-ธีม-สว่าง--มืด)
5. [Flag metadata](#5-flag-metadata)
6. [Variations](#6-variations)
7. [Targeting rules](#7-targeting-rules)
8. [Default rule](#8-default-rule)
9. [JSON Preview](#9-json-preview)
10. [การตรวจสอบข้อมูล (Validation)](#10-การตรวจสอบข้อมูล-validation)
11. [ปุ่มคำสั่งและคีย์ลัด](#11-ปุ่มคำสั่งและคีย์ลัด)
12. [ตัวอย่างการใช้งานแบบครบขั้นตอน](#12-ตัวอย่างการใช้งานแบบครบขั้นตอน)
13. [รูปแบบ JSON ที่ได้](#13-รูปแบบ-json-ที่ได้)
14. [คำถามที่พบบ่อย / การแก้ปัญหา](#14-คำถามที่พบบ่อย--การแก้ปัญหา)
15. [สำหรับนักพัฒนา](#15-สำหรับนักพัฒนา)

---

## 1. ภาพรวม

**Feature Flag** คือสวิตช์ที่ใช้เปิด/ปิดฟีเจอร์ หรือเลือกค่าที่จะส่งให้ผู้ใช้แต่ละกลุ่ม โดยไม่ต้อง deploy โค้ดใหม่
Editor นี้ใช้สร้างไฟล์ตั้งค่า Flag ในรูปแบบของ [GO Feature Flag](https://gofeatureflag.org/editor)

สิ่งที่ทำได้:

- ตั้งชื่อ คำอธิบาย และสถานะ (Enabled/Disabled) ของ Flag
- กำหนดค่าที่ Flag จะคืนกลับ (Variations) เช่น `on = true`, `off = false`
- สร้างกฎ (Targeting rules) ว่าผู้ใช้กลุ่มไหนจะได้ค่าอะไร พร้อมเงื่อนไขแบบซ้อนกลุ่ม (AND / OR)
- เรียงลำดับกฎด้วยการลาก (Drag & Drop)
- ดูผลลัพธ์ JSON ทันทีที่พิมพ์ และคัดลอกไปใช้ได้เลย
- ระบบแจ้ง Error ทันทีเมื่อกรอกข้อมูลไม่ถูกต้อง

เครื่องมือที่ใช้: `@tanstack/react-form` (จัดการฟอร์ม), `zod` (ตรวจสอบข้อมูล), `@monaco-editor/react` (แสดง JSON),
Tailwind CSS (หน้าตา)

---

## 2. การเริ่มต้นใช้งาน

### ความต้องการของระบบ

- Node.js 20 ขึ้นไป
- pnpm (หรือ npm)
- เบราว์เซอร์รุ่นใหม่ (Chrome, Edge, Firefox, Safari)

### ติดตั้งและเปิดโปรแกรม

```bash
pnpm install        # ติดตั้ง dependencies (ทำครั้งแรกครั้งเดียว)
pnpm dev            # เปิด dev server ที่ http://localhost:3000
```

จากนั้นเปิดเบราว์เซอร์ไปที่

```
http://localhost:3000/code-challenge/feature-flag-form
```

แอปนี้มี **หน้าเดียว** คือหน้า Editor ด้านบน ถ้าเปิด URL อื่น เช่น `http://localhost:3000/` หรือพิมพ์ path ผิด
ระบบจะพาไปหน้า Editor ให้อัตโนมัติ (redirect)

> ถ้าพอร์ต 3000 ถูกใช้งานอยู่ ให้ระบุพอร์ตอื่น เช่น `pnpm vite dev --port 3001`

### คำสั่งอื่นที่ใช้บ่อย

| คำสั่ง        | ใช้ทำอะไร                   |
| ------------- | --------------------------- |
| `pnpm test`   | รันชุดทดสอบทั้งหมด (Vitest) |
| `pnpm build`  | build สำหรับ production     |
| `pnpm lint`   | ตรวจโค้ดด้วย ESLint         |
| `pnpm format` | ตรวจรูปแบบโค้ดด้วย Prettier |

---

## 3. ส่วนประกอบของหน้าจอ

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Feature Flag Editor                                  [ ☀ Light | ☾ Dark ] │  ← ส่วนหัว + ปุ่มเลือกธีม
├───────────────────────────────────────┬──────────────────────────────────┤
│ ① Flag metadata                       │ ⑤ flags.json  [valid]   [Copy]   │
│    ชื่อ / คำอธิบาย / สถานะ              │ ┌──────────────────────────────┐ │
│ ② Variations                          │ │ {                            │ │
│    ชนิดค่า + รายการ variation           │ │   "flags": { ... }           │ │
│ ③ Targeting rules                     │ │ }                            │ │
│    Rule 1  [If ...] [Serve ...]       │ └──────────────────────────────┘ │
│    Rule 2  ...                        │ ⑥ รายการ Error / Configuration valid│
│ ④ Default rule                        │ ⑦ [Validate & copy JSON] [Reset] │
└───────────────────────────────────────┴──────────────────────────────────┘
```

| หมายเลข | ส่วน            | หน้าที่                    |
| ------- | --------------- | -------------------------- |
| ①       | Flag metadata   | ข้อมูลหลักของ Flag         |
| ②       | Variations      | ค่าที่ Flag คืนได้         |
| ③       | Targeting rules | กฎกำหนดว่าใครได้ค่าอะไร    |
| ④       | Default rule    | ค่าที่ใช้เมื่อไม่มีกฎใดตรง |
| ⑤       | JSON Preview    | ผลลัพธ์แบบ real-time       |
| ⑥       | Issue list      | รายการข้อผิดพลาดทั้งหมด    |
| ⑦       | ปุ่มคำสั่ง      | ตรวจสอบ + คัดลอก / ล้างค่า |

บนจอกว้าง (≥ 1280px) ฟอร์มอยู่ซ้ายและ Preview อยู่ขวา โดย Preview จะติดหน้าจอขณะเลื่อน
บนจอแคบหรือมือถือ Preview จะย้ายไปอยู่ใต้ฟอร์ม

---

## 4. ธีม: สว่าง / มืด

มุมขวาบนมีปุ่มเลือกธีม 2 โหมด

| โหมด                   | ลักษณะ                                                   |
| ---------------------- | -------------------------------------------------------- |
| **1. Light (สว่าง)** ☀ | พื้นขาว ตัวอักษรเข้ม และ JSON Preview พื้นขาว            |
| **2. Dark (มืด)** ☾    | พื้นดำ ตัวอักษรขาว และ JSON Preview พื้นดำ (ค่าเริ่มต้น) |

- คลิกที่ **Light** หรือ **Dark** เพื่อสลับได้ทันที
- ระบบ **จำธีมที่เลือก** ไว้ในเบราว์เซอร์ (localStorage คีย์ `feature-flag-editor:theme`) เปิดครั้งหน้าจะได้ธีมเดิม
- ธีมมีผลกับทั้งหน้า (Editor แสดงเต็มหน้าจอ) และไม่ขึ้นกับการตั้งค่าโหมดมืดของระบบปฏิบัติการ
- ใช้ปุ่ม Tab เลือกปุ่มธีมแล้วกด Enter หรือ Space เพื่อสลับได้
- ถ้าเบราว์เซอร์บล็อก localStorage (เช่น private mode บางแบบ) ธีมยังสลับได้ตามปกติ แต่จะไม่ถูกจำไว้

---

## 5. Flag metadata

ข้อมูลหลักของ Flag

### 5.1 Flag name (ชื่อ Flag) — **บังคับ**

- ใช้เป็น **key** ของ Flag ใน JSON เช่น `"my-new-feature": { ... }`
- กฎการตั้งชื่อ:
  - ห้ามว่าง
  - ยาวไม่เกิน 64 ตัวอักษร
  - ขึ้นต้นด้วยตัวอักษรหรือตัวเลข
  - ใช้ได้เฉพาะ `A-Z a-z 0-9 . - _` (**ห้ามมีช่องว่าง**)
- ตัวอย่างที่ถูกต้อง: `my-new-feature`, `checkout_v2`, `beta.dashboard`
- ตัวอย่างที่ผิด: `my feature` (มีช่องว่าง), `-flag` (ขึ้นต้นด้วยขีด)
- ถ้าเว้นว่าง JSON จะแสดง key ชั่วคราวเป็น `untitled-flag`

### 5.2 Description (คำอธิบาย) — ไม่บังคับ

- อธิบายว่า Flag นี้ควบคุมอะไร ยาวไม่เกิน 500 ตัวอักษร
- เมื่อกรอกแล้ว จะปรากฏใน JSON เป็น `"metadata": { "description": "..." }`
- ถ้าเว้นว่าง จะไม่มี `metadata` ใน JSON

### 5.3 Status (สถานะ)

- สวิตช์ **Enabled / Disabled**
- **Enabled** (ค่าเริ่มต้น): Flag ทำงานตามกฎปกติ และ JSON จะไม่มีคีย์เพิ่ม
- **Disabled**: Flag ถูกปิด ผู้ใช้ทุกคนจะได้ค่า default ของ SDK และ JSON จะมี `"disable": true`

---

## 6. Variations

**Variation** คือค่าที่ Flag สามารถคืนกลับได้ เช่น `on = true` และ `off = false`

### 6.1 Variation type (ชนิดค่า)

| ชนิด    | ช่องกรอกค่า               | ตัวอย่างค่า         | ค่าใน JSON            |
| ------- | ------------------------- | ------------------- | --------------------- |
| Boolean | dropdown `true` / `false` | `true`              | `true`                |
| String  | ช่องข้อความ               | `blue`              | `"blue"`              |
| Number  | ช่องตัวเลข                | `42`, `2.5`         | `42`, `2.5`           |
| JSON    | ช่องข้อความหลายบรรทัด     | `{"color": "blue"}` | `{ "color": "blue" }` |

> **หมายเหตุ:** เมื่อเปลี่ยนชนิด ค่าของทุก variation จะถูกรีเซ็ตเป็นค่าเริ่มต้นของชนิดใหม่
> (Boolean → true/false สลับกัน, Number → 0, 1, 2…, JSON → `{}`, String → `value-1`, `value-2`…)
> เพื่อไม่ให้เหลือค่าที่ผิดชนิด

### 6.2 รายการ Variation

แต่ละแถวมี:

- **จุดสี:** สีประจำ variation ช่วยให้แยกแต่ละตัวได้ง่าย
- **Name:** ชื่อ variation (บังคับ) ใช้ได้ `A-Z a-z 0-9 _ - .` และ**ห้ามซ้ำกัน**
- **Value:** ค่าของ variation ต้องตรงกับชนิดที่เลือก
- **ปุ่มถังขยะ:** ลบ variation (ต้องเหลืออย่างน้อย **2** ตัว ถ้าเหลือ 2 ตัวปุ่มจะกดไม่ได้)

กด **Add variation** เพื่อเพิ่มแถวใหม่ ชื่อเริ่มต้นจะเป็น `variation-3`, `variation-4` …

### 6.3 การเปลี่ยนชื่อและการลบ Variation

- **เปลี่ยนชื่อ:** กฎทุกข้อที่ใช้ variation นั้นจะเปลี่ยนตามอัตโนมัติ ไม่ต้องเลือกใหม่
  (ระบบอ้างอิง variation ด้วย id ภายใน ไม่ใช่ชื่อ)
- **ลบ:** กฎที่เคยใช้ variation นั้นจะแสดง `(deleted variation)` พร้อม Error
  "This variation no longer exists" ให้เลือก variation ใหม่

---

## 7. Targeting rules

**Targeting rule** คือกฎที่บอกว่า "ถ้าผู้ใช้ตรงเงื่อนไข X ให้ได้ variation Y"

- กฎทำงาน **จากบนลงล่าง** กฎแรกที่ตรงจะถูกใช้ทันที
- ถ้าไม่มีกฎใดตรง ระบบจะใช้ **Default rule** (หัวข้อ 8)

### 7.1 เพิ่ม / ลบกฎ

- กด **Add rule** (หรือ **Add your first rule** ถ้ายังไม่มีกฎ)
- กฎใหม่จะมีเงื่อนไขว่าง 1 ข้อ, rollout 100% และ serve variation ตัวแรก
- กด **ไอคอนถังขยะสีแดง** ที่หัวกฎเพื่อลบ

### 7.2 ส่วนหัวของกฎ

| ส่วน            | คำอธิบาย                                                                   |
| --------------- | -------------------------------------------------------------------------- |
| ⠿ (จุดจับลาก)   | ลากเพื่อเรียงลำดับ หรือกด Tab ไปที่ปุ่มแล้วใช้ ↑ / ↓                       |
| `Rule 1`        | ลำดับของกฎ                                                                 |
| Rule name       | ชื่อกฎ (ไม่บังคับ ไม่เกิน 80 ตัวอักษร) ใส่แล้วจะปรากฏใน JSON เป็น `"name"` |
| สวิตช์ On / Off | ปิดกฎชั่วคราวโดยไม่ต้องลบ กฎที่ปิดจะจางลง และ JSON จะมี `"disable": true`  |
| ⌃ / ⌄           | เลื่อนกฎขึ้น/ลงทีละ 1 ตำแหน่ง                                              |
| 🗑              | ลบกฎ                                                                       |

### 7.3 การเรียงลำดับกฎ (Drag & Drop)

มี 3 วิธี:

1. **ลากด้วยเมาส์:** กดค้างที่จุดจับ ⠿ แล้วลากไปวางบนกฎตำแหน่งที่ต้องการ (กฎปลายทางจะมีกรอบเน้น)
2. **คีย์บอร์ด:** กด Tab ไปที่จุดจับ ⠿ แล้วกด **↑** หรือ **↓**
3. **ปุ่มลูกศร:** กด ⌃ / ⌄ ที่หัวกฎ

> การลากทำได้เฉพาะที่จุดจับ ⠿ จึงยังคลิกหรือเลือกข้อความในช่องกรอกได้ตามปกติ

### 7.4 ส่วน IF: เงื่อนไข

#### กลุ่มเงื่อนไข (Group)

ทุกกฎมี **กลุ่มหลัก** 1 กลุ่ม ภายในกลุ่มมีได้ทั้ง **เงื่อนไข (Condition)** และ **กลุ่มย่อย (Group)** ซ้อนกันได้ (recursive)

- **All (and):** ต้องตรง **ทุก** เงื่อนไขในกลุ่ม
- **Any (or):** ตรง **อย่างน้อยหนึ่ง** เงื่อนไขก็พอ
- ระหว่างเงื่อนไขจะมีป้าย `AND` / `OR` บอกตัวเชื่อมของกลุ่มนั้น
- เส้นสีด้านซ้ายบอกระดับชั้น: ฟ้า (ชั้น 1) → ม่วง (ชั้น 2) → ส้ม (ชั้น 3) → เขียว (ชั้น 4)
- ซ้อนได้สูงสุด **4 ชั้น** ถ้าถึงชั้นสุดท้ายแล้ว ปุ่ม **Group** จะกดไม่ได้

ปุ่มในกลุ่ม:

| ปุ่ม                 | ผล                                              |
| -------------------- | ----------------------------------------------- |
| **+ Condition**      | เพิ่มเงื่อนไขใหม่ในกลุ่มนี้                     |
| **+ Group**          | เพิ่มกลุ่มย่อย (ตั้งต้นเป็น Any (or))           |
| 🗑 (ที่หัวกลุ่มย่อย) | ลบกลุ่มย่อยทั้งกลุ่ม                            |
| ✕ (ท้ายเงื่อนไข)     | ลบเงื่อนไข (ต้องเหลืออย่างน้อย 1 ข้อในกลุ่ม)    |
| ⠿                    | ลากหรือกด ↑/↓ เพื่อเรียงลำดับภายในกลุ่มเดียวกัน |

#### เงื่อนไข (Condition)

แต่ละเงื่อนไขมี 3 ช่อง: **Attribute**, **Operator** และ **Value**

- **Attribute:** ชื่อข้อมูลของผู้ใช้ เช่น `group`, `role`, `email`, `country`
  - ช่องนี้มีรายการแนะนำให้เลือก (`targetingKey`, `key`, `group`, `role`, `email`, `country`, `plan`, `company`, `beta`, `age`, `appVersion`)
    แต่จะพิมพ์ชื่ออื่นเองก็ได้
  - ต้องขึ้นต้นด้วยตัวอักษรหรือ `_` และใช้ได้ `A-Z a-z 0-9 _ . -`
- **Operator:** ดูตารางด้านล่าง
- **Value:** ค่าที่ใช้เปรียบเทียบ (บาง operator ไม่ต้องใช้)

| Operator               | ความหมาย            | ชนิดค่า            | ตัวอย่างที่กรอก      | Query ที่ได้              |
| ---------------------- | ------------------- | ------------------ | -------------------- | ------------------------- |
| equals (==)            | เท่ากับ             | ข้อความ/ตัวเลข     | `group` · `beta`     | `group == 'beta'`         |
| not equals (!=)        | ไม่เท่ากับ          | ข้อความ/ตัวเลข     | `plan` · `free`      | `plan != 'free'`          |
| is one of (in)         | อยู่ในรายการ        | รายการคั่นด้วย `,` | `country` · `TH, US` | `country in ['TH', 'US']` |
| is not one of (not in) | ไม่อยู่ในรายการ     | รายการคั่นด้วย `,` | `country` · `CN`     | `not (country in ['CN'])` |
| contains (co)          | มีข้อความนี้อยู่    | ข้อความ            | `email` · `@company` | `email co '@company'`     |
| starts with (sw)       | ขึ้นต้นด้วย         | ข้อความ            | `key` · `admin-`     | `key sw 'admin-'`         |
| ends with (ew)         | ลงท้ายด้วย          | ข้อความ            | `email` · `.th`      | `email ew '.th'`          |
| greater than (>)       | มากกว่า             | **ตัวเลข**         | `age` · `18`         | `age > 18`                |
| greater or equal (>=)  | มากกว่าหรือเท่ากับ  | **ตัวเลข**         | `age` · `18`         | `age >= 18`               |
| less than (<)          | น้อยกว่า            | **ตัวเลข**         | `age` · `60`         | `age < 60`                |
| less or equal (<=)     | น้อยกว่าหรือเท่ากับ | **ตัวเลข**         | `age` · `60`         | `age <= 60`               |
| is present (pr)        | มีค่านี้อยู่        | ไม่ต้องกรอก        | `email`              | `email pr`                |

**กฎการแปลงค่า (Value → Query)**

- ตัวเลข (`18`, `2.5`, `-1`) และ `true` / `false` จะ**ไม่ใส่เครื่องหมายคำพูด** เช่น `beta == true`
- ข้อความอื่นจะใส่ `'...'` ให้อัตโนมัติ และ escape `'` ข้างในให้ เช่น `o'reilly` → `'o\'reilly'`
- ถ้าต้องการให้ตัวเลขเป็นข้อความ ให้ใส่คำพูดเอง เช่น `'123'`
- เงื่อนไขที่ยังกรอกไม่ครบจะยังไม่ถูกใส่ใน query (และจะมี Error แจ้ง)

#### Query preview

ใต้กลุ่มเงื่อนไขมีแถบ **query** แสดงผลลัพธ์จริงที่จะอยู่ใน JSON อัปเดตทันทีที่พิมพ์ เช่น

```
group == 'beta' and (country in ['TH', 'US'] or role == 'admin')
```

กลุ่มย่อยที่มีมากกว่า 1 เงื่อนไขจะถูกครอบด้วยวงเล็บให้อัตโนมัติ

### 7.5 ส่วน SERVE: ผลลัพธ์ของกฎ

| ช่อง                   | คำอธิบาย                                                                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| **Rollout percentage** | เปอร์เซ็นต์ของผู้ใช้ที่ตรงเงื่อนไขซึ่งจะได้ variation นี้ (0–100) ปรับได้ทั้งแถบเลื่อนและช่องตัวเลข |
| **Variation** (บังคับ) | variation ที่จะส่งให้ เลือกจากรายการ variations ในหัวข้อ 6                                          |

ตัวอย่าง: เงื่อนไข `group == 'beta'`, rollout `50%`, variation `on`
หมายถึง ผู้ใช้กลุ่ม beta ครึ่งหนึ่งจะได้ `on`

---

## 8. Default rule

- **Serve variation** (บังคับ): variation ที่ใช้เมื่อ **ไม่มีกฎใดตรง** หรือไม่มีกฎเลย
- ค่าเริ่มต้นคือ `off`
- ใน JSON จะเป็น `"defaultRule": { "variation": "off" }`

---

## 9. JSON Preview

- แสดงผลลัพธ์ JSON ด้วย **Monaco Editor** (ตัวเดียวกับ VS Code) แบบอ่านอย่างเดียว พร้อมไฮไลต์สีและพับโค้ดได้
- **อัปเดตทันที** ทุกครั้งที่แก้ไขฟอร์ม
- ป้ายสถานะข้างชื่อไฟล์ `flags.json`:
  - `valid` (เขียว): ข้อมูลถูกต้องทั้งหมด
  - `N errors` (แดง): มีข้อผิดพลาด N รายการ
- ปุ่ม **Copy** (ไอคอนสำเนา): คัดลอก JSON ไปยังคลิปบอร์ด ไอคอนจะเปลี่ยนเป็น ✓ ชั่วคราว
- JSON แสดงได้แม้ข้อมูลยังมี Error เพื่อให้เห็นผลระหว่างกรอก แต่ควรแก้ Error ให้หมดก่อนนำไปใช้จริง

---

## 10. การตรวจสอบข้อมูล (Validation)

ระบบใช้ **Zod** ตรวจสอบข้อมูลทุกครั้งที่แก้ไข

### 10.1 Error แสดงที่ไหนบ้าง

1. **ใต้ช่องที่ผิด (inline):** ข้อความสีแดง และช่องจะมีกรอบแดง แสดงหลังจากแตะช่องนั้นแล้ว หรือหลังกดปุ่ม Validate
2. **รายการ Issue ใต้ JSON Preview:** แสดงทุกข้อผิดพลาดพร้อมตำแหน่ง เช่น
   `Rule 1 › Group 2 › Condition 1 › Value — Value is required`
   **คลิกที่รายการ** เพื่อเลื่อนไปที่ช่องนั้นและให้ช่องถูกเลือกทันที
3. **ป้ายสถานะ** ในหัว JSON Preview

### 10.2 ตาราง Error ทั้งหมด

| ข้อความ                                            | เกิดเมื่อ                                 | วิธีแก้                      |
| -------------------------------------------------- | ----------------------------------------- | ---------------------------- |
| Flag name is required                              | ชื่อ Flag ว่าง                            | กรอกชื่อ                     |
| Flag name is too long (max 64)                     | ชื่อยาวเกิน 64 ตัว                        | ตัดให้สั้นลง                 |
| Use letters, numbers, ".", "-" or "\_" (no spaces) | ชื่อ Flag มีช่องว่างหรืออักขระพิเศษ       | ใช้ `-` หรือ `_` แทนช่องว่าง |
| Description is too long (max 500)                  | คำอธิบายยาวเกิน 500 ตัว                   | ตัดให้สั้นลง                 |
| Variation name is required                         | ชื่อ variation ว่าง                       | กรอกชื่อ                     |
| Use letters, numbers, "\_", "-" or "." only        | ชื่อ variation มีอักขระที่ไม่อนุญาต       | แก้ชื่อ                      |
| Variation "x" already exists                       | ชื่อ variation ซ้ำ                        | เปลี่ยนชื่อให้ไม่ซ้ำ         |
| Value must be true or false                        | ชนิด Boolean แต่ค่าไม่ใช่ true/false      | เลือก true หรือ false        |
| Value must be a number                             | ชนิด Number แต่ค่าไม่ใช่ตัวเลข            | กรอกตัวเลข                   |
| Value must be valid JSON                           | ชนิด JSON แต่รูปแบบผิด                    | ตรวจวงเล็บ/เครื่องหมายคำพูด  |
| Value must be a JSON object or array               | ชนิด JSON แต่เป็นค่าเดี่ยว เช่น `5`       | ใช้ `{...}` หรือ `[...]`     |
| Add at least two variations                        | variation น้อยกว่า 2                      | เพิ่ม variation              |
| Attribute is required                              | ช่อง Attribute ว่าง                       | กรอก attribute               |
| Attribute must start with a letter (...)           | attribute มีรูปแบบผิด                     | ขึ้นต้นด้วยตัวอักษร          |
| Value is required                                  | ช่อง Value ว่าง (operator ที่ต้องใช้ค่า)  | กรอกค่า                      |
| This operator needs a number                       | operator `> >= < <=` แต่ค่าไม่ใช่ตัวเลข   | กรอกตัวเลข                   |
| Enter at least one value, separated by commas      | operator `in` / `not in` แต่ไม่มีค่า      | กรอก เช่น `TH, US`           |
| A group needs at least one condition               | กลุ่มว่าง                                 | เพิ่มเงื่อนไขหรือลบกลุ่ม     |
| Rule name is too long (max 80)                     | ชื่อกฎยาวเกิน 80 ตัว                      | ตัดให้สั้นลง                 |
| Percentage must be between 0 and 100               | rollout ว่าง หรือน้อยกว่า 0 / มากกว่า 100 | กรอก 0–100                   |
| Select a variation                                 | ยังไม่เลือก variation                     | เลือก variation              |
| This variation no longer exists                    | variation ที่เลือกถูกลบไปแล้ว             | เลือก variation ใหม่         |

---

## 11. ปุ่มคำสั่งและคีย์ลัด

### ปุ่มคำสั่ง

| ปุ่ม                     | การทำงาน                                                                                        |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| **Validate & copy JSON** | ตรวจสอบทั้งฟอร์ม ถ้าผิดจะแสดง Error ทุกช่อง ถ้าถูกจะคัดลอก JSON และแสดง "Valid, copied at เวลา" |
| **Reset**                | ล้างฟอร์มกลับเป็นค่าเริ่มต้น (**ข้อมูลที่กรอกจะหายทั้งหมด**)                                    |
| **Copy** (ในหัว Preview) | คัดลอก JSON ทันทีโดยไม่ตรวจสอบ                                                                  |
| **Light / Dark**         | สลับธีม                                                                                         |

### คีย์บอร์ด

| ปุ่ม                       | ผล                                        |
| -------------------------- | ----------------------------------------- |
| `Tab` / `Shift+Tab`        | เลื่อนไปช่องถัดไป / ก่อนหน้า              |
| `↑` / `↓` บนจุดจับ ⠿       | เลื่อนกฎหรือเงื่อนไขขึ้น/ลง               |
| `Space` / `Enter` บนสวิตช์ | เปิด/ปิด                                  |
| `Enter` ในช่องกรอก         | ส่งฟอร์ม (เท่ากับกด Validate & copy JSON) |

---

## 12. ตัวอย่างการใช้งานแบบครบขั้นตอน

**โจทย์:** เปิดฟีเจอร์ "new-checkout" ให้ผู้ใช้กลุ่ม beta ทุกคน และให้ admin จากประเทศไทยหรือสหรัฐฯ 20%
ส่วนคนอื่นยังใช้แบบเดิม

1. **Flag metadata:** ตั้ง Flag name เป็น `new-checkout`, Description เป็น `New checkout flow` และให้ Status เป็น Enabled
2. **Variations:** ใช้ชนิด Boolean โดยมี `on = true` และ `off = false` (ค่าเริ่มต้น)
3. **Rule 1:** Attribute `group`, Operator `equals`, Value `beta`, Rollout `100`, Variation `on`
4. กด **Add rule** แล้วตั้งค่า **Rule 2**:
   - เงื่อนไขแรก: `role` · `equals` · `admin`
   - กด **+ Group** (เป็น Any (or)) แล้วใส่ `country` · `equals` · `TH`
   - กด **+ Condition** ในกลุ่มย่อย แล้วใส่ `country` · `equals` · `US`
   - Rollout `20` และ Variation `on`
5. **Default rule:** ใช้ `off`
6. ตรวจว่าป้ายใน Preview เป็น `valid` แล้วกด **Validate & copy JSON**

ผลลัพธ์:

```json
{
  "flags": {
    "new-checkout": {
      "variations": { "on": true, "off": false },
      "targeting": [
        { "query": "group == 'beta'", "percentage": 100, "variation": "on" },
        {
          "query": "role == 'admin' and (country == 'TH' or country == 'US')",
          "percentage": 20,
          "variation": "on"
        }
      ],
      "defaultRule": { "variation": "off" },
      "metadata": { "description": "New checkout flow" }
    }
  }
}
```

---

## 13. รูปแบบ JSON ที่ได้

### โครงสร้าง

```jsonc
{
  "flags": {
    "<ชื่อ flag>": {
      "variations": { "<ชื่อ>": <ค่า>, ... },      // เสมอ
      "targeting": [                               // เฉพาะเมื่อมีกฎ
        {
          "name": "<ชื่อกฎ>",                       // เฉพาะเมื่อกรอก
          "query": "<เงื่อนไข>",
          "percentage": <0-100>,
          "variation": "<ชื่อ variation>",
          "disable": true                          // เฉพาะเมื่อปิดกฎ
        }
      ],
      "defaultRule": { "variation": "<ชื่อ variation>" }, // เสมอ
      "disable": true,                             // เฉพาะเมื่อ Status = Disabled
      "metadata": { "description": "<คำอธิบาย>" }  // เฉพาะเมื่อกรอกคำอธิบาย
    }
  }
}
```

### การแปลงฟิลด์ → JSON

| ฟิลด์ในฟอร์ม       | คีย์ใน JSON                   | ใส่เมื่อไหร่ |
| ------------------ | ----------------------------- | ------------ |
| Flag name          | key ของ object ใน `flags`     | เสมอ         |
| Description        | `metadata.description`        | เมื่อไม่ว่าง |
| Status = Disabled  | `disable: true`               | เมื่อปิด     |
| Variations         | `variations` (ค่าแปลงตามชนิด) | เสมอ         |
| Rule name          | `targeting[].name`            | เมื่อไม่ว่าง |
| เงื่อนไข (IF)      | `targeting[].query`           | เสมอ         |
| Rollout percentage | `targeting[].percentage`      | เสมอ         |
| Variation ของกฎ    | `targeting[].variation`       | เสมอ         |
| สวิตช์กฎ = Off     | `targeting[].disable: true`   | เมื่อปิด     |
| Default rule       | `defaultRule.variation`       | เสมอ         |

ค่าเริ่มต้นตอนเปิดหน้าครั้งแรกจะได้ JSON ตรงกับ `expected.json` ของโจทย์ทุกตัวอักษร

```json
{
  "flags": {
    "my-new-feature": {
      "variations": { "on": true, "off": false },
      "targeting": [
        { "query": "group == 'beta'", "percentage": 50, "variation": "on" }
      ],
      "defaultRule": { "variation": "off" }
    }
  }
}
```

---

## 14. คำถามที่พบบ่อย / การแก้ปัญหา

**ถาม: กดปุ่ม Validate แล้วไม่ได้คัดลอก JSON?**
ตอบ: ปุ่มจะคัดลอกเฉพาะเมื่อไม่มี Error ให้ดูรายการ Issue ใต้ Preview แล้วแก้ให้หมด
บางเบราว์เซอร์จะบล็อกคลิปบอร์ดถ้าไม่ได้เปิดผ่าน `localhost` หรือ `https` กรณีนั้นให้คัดลอกจาก Preview เอง

**ถาม: ลากกฎไม่ได้?**
ตอบ: ต้องกดค้างที่จุดจับ ⠿ เท่านั้น ถ้ายังไม่ได้ ให้ใช้คีย์บอร์ด (↑/↓) หรือปุ่ม ⌃ / ⌄ แทน

**ถาม: ลากเงื่อนไขข้ามกลุ่มได้ไหม?**
ตอบ: ยังไม่ได้ ลากได้เฉพาะภายในกลุ่มเดียวกัน ถ้าต้องการย้าย ให้ลบแล้วสร้างใหม่ในกลุ่มที่ต้องการ

**ถาม: เปลี่ยนชนิด Variation แล้วค่าหาย?**
ตอบ: เป็นการทำงานที่ตั้งใจไว้ ค่าจะถูกรีเซ็ตเป็นค่าเริ่มต้นของชนิดใหม่ เพื่อไม่ให้เหลือค่าที่ผิดชนิด

**ถาม: ทำไม query มีเครื่องหมาย `'` รอบค่า?**
ตอบ: เป็น syntax ของ GO Feature Flag สำหรับข้อความ ส่วนตัวเลขและ `true` / `false` จะไม่มีเครื่องหมายคำพูด

**ถาม: กด Reset แล้วข้อมูลกลับมาได้ไหม?**
ตอบ: ไม่ได้ Reset จะล้างข้อมูลทั้งหมด ควรกด Copy เก็บ JSON ไว้ก่อน

**ถาม: ข้อมูลที่กรอกถูกบันทึกไว้ไหม?**
ตอบ: ไม่ ข้อมูลในฟอร์มอยู่ในหน้าเว็บเท่านั้น รีเฟรชแล้วจะหาย ระบบจำไว้แค่ธีมที่เลือก

**ถาม: Monaco (JSON Preview) ขึ้นเป็นกล่องเทาค้าง?**
ตอบ: Monaco โหลดไฟล์จาก CDN ต้องมีอินเทอร์เน็ต ตรวจการเชื่อมต่อหรือ extension ที่บล็อก CDN

---

## 15. สำหรับนักพัฒนา

### 15.1 ตำแหน่งไฟล์

```
src/routes/
├── __root.tsx                     HTML shell (ไม่มี sidebar / layout อื่น)
├── index.tsx                      "/"  → redirect ไปหน้า Editor
├── $.tsx                          path อื่นทั้งหมด → redirect ไปหน้า Editor
└── code-challenge.feature-flag-form.tsx   หน้าเดียวของแอป

src/pages/code-challenge/feature-flag-form/
├── index.tsx                      หน้า route (render แค่ Editor)
└── your-codes/
    ├── index.tsx                  ประกอบหน้า: ฟอร์ม + Preview + ธีม
    ├── editor-theme.css           สีของธีม Light / Dark (scoped)
    ├── schema/flag-schema.ts      Zod schema ทั้งหมด (recursive group + cross-field rules)
    ├── model/
    │   ├── operators.ts           registry ของ operator
    │   ├── variation-types.ts     ชนิด variation + ค่าเริ่มต้น + สี
    │   ├── factories.ts           ฟังก์ชันสร้าง rule / group / condition / ค่าเริ่มต้น
    │   └── form-values.ts         type ของฟอร์ม + path types
    ├── lib/                       logic ล้วน (ไม่มี React) มี unit test
    │   ├── build-query.ts         แปลงกลุ่มเงื่อนไข → query string
    │   ├── query-literal.ts       แปลงค่า → literal ใน query
    │   ├── to-go-feature-flag.ts  ฟอร์ม → JSON
    │   ├── variation-value.ts     แปลงค่า variation ตามชนิด
    │   ├── validate.ts            Zod issues → error ของ TanStack field
    │   └── describe-issue.ts      path → ข้อความตำแหน่งที่อ่านง่าย
    ├── hooks/
    │   ├── use-flag-editor-form.ts  สร้าง TanStack form + validator
    │   ├── use-drag-reorder.ts      Drag & Drop (HTML5) + คีย์บอร์ด
    │   └── use-editor-theme.ts      ธีม Light / Dark + localStorage
    └── components/                UI แยกตามส่วน
        ├── flag-settings-section.tsx  Flag metadata
        ├── variations-section.tsx     Variations
        ├── targeting-section.tsx      รายการกฎ + DnD
        ├── rule-card.tsx              กฎ 1 ข้อ (IF + SERVE)
        ├── condition-group-editor.tsx กลุ่มเงื่อนไข (เรียกตัวเองซ้ำ / recursive)
        ├── condition-row.tsx          เงื่อนไข 1 แถว
        ├── default-rule-section.tsx   Default rule
        ├── preview-panel.tsx          Monaco + รายการ Issue
        ├── theme-switch.tsx           ปุ่ม Light / Dark
        └── ...                        form-item, editor-section, drag-handle, variation-select
```

### 15.2 การไหลของข้อมูล

```
ผู้ใช้พิมพ์ ─► form.Field (TanStack) ─► form state
                                   │
             ┌─────────────────────┼──────────────────────────┐
             ▼                     ▼                          ▼
   validators.onChange     form.Subscribe (Preview)   form.Subscribe (query ต่อกฎ)
   └─ Zod (flagSchema)     └─ toGoffConfig() → JSON   └─ buildQuery()
   └─ { fields: {...} }       └─ Monaco
      → error ใต้แต่ละช่อง
```

### 15.3 เพิ่ม Operator ใหม่

แก้ที่ `model/operators.ts` ไฟล์เดียว:

```ts
export const OPERATOR_IDS = [..., 'mt'] as const

export const OPERATORS = {
  ...,
  mt: {
    label: 'matches regex (mt)',
    valueKind: 'text',                         // 'text' | 'number' | 'list' | 'none'
    toQuery: (a, v) => `${a} mt ${toLiteral(v)}`,
  },
}
```

dropdown, ช่องกรอกค่า, validation และ query จะรองรับ operator ใหม่ให้อัตโนมัติ

### 15.4 เพิ่มชนิด Variation ใหม่

1. เพิ่มใน `VARIATION_TYPES` และ `VARIATION_TYPE_LABELS` (`model/variation-types.ts`)
2. กำหนดค่าเริ่มต้นใน `defaultVariationValue`
3. เพิ่มการตรวจใน `variationValueError` (`schema/flag-schema.ts`)
4. เพิ่มการแปลงใน `parseVariationValue` (`lib/variation-value.ts`)
5. (ถ้าต้องใช้ช่องกรอกแบบพิเศษ) แก้ `VariationValueField` ใน `variations-section.tsx`

### 15.5 ปรับสีธีม

แก้ค่าตัวแปรใน `editor-theme.css` ใต้ `.ff-theme-light` หรือ `.ff-theme-dark`
ส่วนสีพื้นของ Monaco แก้ที่ `defineMonacoThemes` ใน `components/preview-panel.tsx`

### 15.6 การทดสอบ

```bash
pnpm test
```

- `lib/flag-logic.test.ts`: ทดสอบ output JSON, query builder และ validation (รวมเงื่อนไขซ้อนลึกและ cross-field)
- `feature-flag-editor.test.tsx`: ทดสอบฟอร์มจริงด้วย React Testing Library
  (ค่าเริ่มต้นตรง expected.json, error ชื่อว่าง, กลุ่มซ้อน, submit, เรียงด้วยคีย์บอร์ด, variations, ธีม)

### 15.7 ข้อจำกัดที่ทราบ

- ลากเงื่อนไขข้ามกลุ่มไม่ได้ (เรียงได้เฉพาะภายในกลุ่มเดียวกัน)
- ไม่มีการบันทึกข้อมูลฟอร์ม (รีเฟรชแล้วหาย)
- ยังนำเข้า (import) JSON เดิมกลับเข้าฟอร์มไม่ได้

รายละเอียดเหตุผลเชิงเทคนิคเพิ่มเติมดูได้ที่ [`NOTES.md`](./NOTES.md)

