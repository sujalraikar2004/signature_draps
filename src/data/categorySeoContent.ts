export interface CategorySeoContent {
  key: string;
  h1: string;
  intro: string[];
  benefits: string[];
  buyingGuide: string[];
  applications: string[];
  customization: string;
  installation: string;
  faqs: { question: string; answer: string }[];
  relatedLinks: { label: string; path: string }[];
}

export const categorySeoContent: Record<string, CategorySeoContent> = {
  "curtains-and-accessories": {
    key: "curtains-and-accessories",
    h1: "Curtains and Accessories for Homes, Offices, and Premium Interiors",
    intro: [
      "Curtains are one of the most important finishing elements in an interior because they control light, soften acoustics, improve privacy, and define the mood of a room. Signature Drapes offers curtains and accessories for bedrooms, living rooms, offices, hotels, clinics, institutions, and custom interior projects. The collection is planned for practical Indian homes as well as premium design-led spaces where fabric, fall, lining, track quality, and accurate measurement all matter.",
      "A well-selected curtain is not just a piece of fabric on a window. It should suit the wall color, furniture, window size, ceiling height, amount of sunlight, privacy need, and daily usage pattern. This category helps customers compare ready-made curtains, custom curtains, curtain tracks, rods, brackets, accessories, and supporting products so that the final installation looks complete rather than temporary."
    ],
    benefits: [
      "Improves privacy without making rooms feel closed or heavy.",
      "Helps manage sunlight, glare, and heat during bright daytime hours.",
      "Adds softness and visual height to living rooms, bedrooms, and workspaces.",
      "Supports layered styling with sheers, blackout curtains, tracks, and accessories."
    ],
    buyingGuide: [
      "Start by deciding whether the room needs decorative curtains, privacy curtains, blackout performance, or a layered sheer plus main curtain setup. Bedrooms usually benefit from thicker fabric or lining, while living rooms can use lighter textured curtains that filter daylight.",
      "Measure width beyond the window frame so the curtain can stack neatly when opened. For a richer look, choose enough fabric fullness instead of a flat panel. Ceiling-mounted tracks can make the room look taller, while rods can work well when the hardware is part of the design.",
      "Check how the curtain will be cleaned, how often it will be moved, and whether children or pets use the room. Hardware quality is important for daily use because even premium fabric will feel poor if the track, hooks, brackets, or rings do not move smoothly."
    ],
    applications: [
      "Living rooms, bedrooms, balconies, French windows, sliding doors, offices, hotels, rental homes, clinics, schools, and staged apartments.",
      "Useful for privacy, blackout, heat reduction, decorative styling, room zoning, and completing renovation projects."
    ],
    customization: "Curtains can often be customized by fabric, width, drop length, lining, pleat style, track type, and accessory selection. For large windows or unusual spaces, custom measurement is usually better than forcing a ready-made size to fit.",
    installation: "For best results, measure from the final track or rod position, not only the window glass. Decide whether the curtain should touch the floor, float slightly above it, or cover a sill. Professional installation helps align brackets, tracks, and fabric fall so the curtain opens cleanly and does not drag.",
    faqs: [
      {
        question: "Are custom curtains better than ready-made curtains?",
        answer: "Custom curtains are better when the window size, ceiling height, fabric fullness, or blackout requirement is specific. Ready-made curtains can work well for standard windows and quicker installations."
      },
      {
        question: "Which curtains are best for bedrooms?",
        answer: "Bedrooms usually need privacy and light control, so blackout or lined curtains are a strong choice. Sheer curtains can be added as a second layer for daytime softness."
      },
      {
        question: "Do curtain accessories affect the final look?",
        answer: "Yes. Tracks, rods, hooks, brackets, rings, and tiebacks affect movement, durability, and finishing. Good accessories make the curtain easier to use and more polished."
      }
    ],
    relatedLinks: [
      { label: "Zebra Blinds", path: "/category/window-blinds?subcategory=zebra-blinds" },
      { label: "Roller Blinds", path: "/category/window-blinds?subcategory=roller-blinds" },
      { label: "Wallpapers", path: "/category/home-decor-wallpaper-stickers" },
      { label: "Wooden Blinds", path: "/category/pvc-wooden-window-blinds?subcategory=wooden-blinds" },
      { label: "Artificial Grass", path: "/category/artificial-grass-plant-vertical-garden?subcategory=lawn-grass" }
    ]
  },
  "zebra-blinds": {
    key: "zebra-blinds",
    h1: "Zebra Blinds for Modern Light Control and Privacy",
    intro: [
      "Zebra blinds are a popular choice for modern homes and offices because they combine the softness of fabric with the control of a blind. Their alternating sheer and opaque bands allow you to shift between filtered daylight, partial privacy, and a more closed setting without fully raising the blind. This makes zebra blinds especially useful for living rooms, bedrooms, offices, clinics, and spaces where the window needs to look clean throughout the day.",
      "Signature Drapes zebra blinds are suited for customers who want a neat, contemporary window treatment with simple operation. They work well with neutral interiors, premium furniture, compact apartments, and commercial cabins where bulky curtains may feel heavy."
    ],
    benefits: [
      "Offers flexible daylight control through sheer and opaque fabric bands.",
      "Creates a clean, modern look without heavy fabric stacking.",
      "Works well for apartments, offices, study rooms, and bedrooms.",
      "Easy to pair with curtains when a layered premium finish is needed."
    ],
    buyingGuide: [
      "Choose zebra blinds when you want privacy and daylight control in the same product. For rooms with strong sunlight, select denser fabric and consider darker tones for glare control. For soft daylight, lighter neutral shades can keep the room open.",
      "Measure the window carefully and decide between inside mount and outside mount. Inside mount looks minimal if there is enough window depth. Outside mount covers gaps better and can improve privacy.",
      "Check the chain, brackets, fabric alignment, and roll quality. A zebra blind should move smoothly and stop cleanly at the desired level."
    ],
    applications: [
      "Living rooms, bedrooms, office cabins, study rooms, reception areas, clinics, and modern apartments.",
      "Useful for windows where customers want daytime privacy without making the room dark."
    ],
    customization: "Zebra blinds can be customized by width, height, fabric shade, opacity, cassette style, and control side. Larger windows may need separate blinds for better operation.",
    installation: "Accurate measurement is important because zebra bands must align neatly. Check wall clearance, handle projection, and whether the blind will be mounted inside the frame or outside the frame.",
    faqs: [
      {
        question: "Do zebra blinds provide privacy at night?",
        answer: "Zebra blinds provide privacy when the opaque bands are aligned, but bright indoor lighting may still create visibility depending on fabric density. For full privacy, choose a denser fabric or add curtains."
      },
      {
        question: "Are zebra blinds good for living rooms?",
        answer: "Yes. They are ideal for living rooms because they allow soft daylight during the day and a cleaner closed look when privacy is needed."
      }
    ],
    relatedLinks: [
      { label: "Curtains", path: "/category/curtains-and-accessories" },
      { label: "Roller Blinds", path: "/category/window-blinds?subcategory=roller-blinds" },
      { label: "Wooden Blinds", path: "/category/pvc-wooden-window-blinds?subcategory=wooden-blinds" },
      { label: "Wallpapers", path: "/category/home-decor-wallpaper-stickers" }
    ]
  },
  "roller-blinds": {
    key: "roller-blinds",
    h1: "Roller Blinds for Minimal Windows and Everyday Sun Control",
    intro: [
      "Roller blinds are a practical window covering for customers who want a simple, minimal, and easy-to-operate solution. They roll into a compact tube, keep the window area clean, and are suitable for homes, offices, shops, institutions, and commercial spaces. Depending on the fabric, roller blinds can filter light, reduce glare, improve privacy, or darken a room for better rest and screen visibility.",
      "The main advantage of roller blinds is their versatility. A transparent or sunscreen fabric can manage daylight while keeping the room bright, while blackout fabric is useful for bedrooms, conference rooms, media rooms, and cabins."
    ],
    benefits: [
      "Compact design with a clean, uncluttered window finish.",
      "Available in sunscreen, dimout, and blackout fabric behavior.",
      "Good for offices, bedrooms, kitchens, clinics, and commercial interiors.",
      "Easy to operate and suitable for multiple windows in the same room."
    ],
    buyingGuide: [
      "Select fabric based on the main purpose. Sunscreen fabric is useful where glare reduction matters but daylight should remain. Blackout fabric is better for sleep, privacy, projectors, and high sun exposure.",
      "Measure width and height carefully, including whether the blind should sit inside the window recess or cover the frame from outside. Outside mount often gives better light control because it covers side gaps.",
      "For wide windows, ask whether one large blind or multiple sections will operate better. Smaller independent sections can reduce fabric wave and make daily use easier."
    ],
    applications: [
      "Bedrooms, offices, conference rooms, kitchens, hospitals, schools, retail counters, balcony windows, and rental apartments.",
      "Useful for glare control, privacy, blackout needs, and simple modern interiors."
    ],
    customization: "Roller blinds can be customized by fabric, width, height, roll direction, bracket type, cassette option, and chain side. Fabric choice should match the sunlight level and privacy requirement.",
    installation: "Before installation, check window handles, grill position, wall depth, and ceiling clearance. A level mounting line is important so the fabric rolls evenly and does not drift to one side.",
    faqs: [
      {
        question: "Are roller blinds better than curtains?",
        answer: "Roller blinds are better for compact, minimal, and functional windows. Curtains are better when softness, layering, and decorative fabric are the priority."
      },
      {
        question: "Can roller blinds block sunlight completely?",
        answer: "Blackout roller blinds can block most light through the fabric, but side gaps depend on measurement and mounting style."
      }
    ],
    relatedLinks: [
      { label: "Zebra Blinds", path: "/category/window-blinds?subcategory=zebra-blinds" },
      { label: "Curtains", path: "/category/curtains-and-accessories" },
      { label: "PVC Blinds", path: "/category/pvc-wooden-window-blinds?subcategory=pvc-blinds" },
      { label: "Wallpapers", path: "/category/home-decor-wallpaper-stickers" }
    ]
  },
  "wooden-blinds": {
    key: "wooden-blinds",
    h1: "Wooden Blinds for Warm, Premium Window Styling",
    intro: [
      "Wooden blinds bring warmth, texture, and premium visual structure to a window. They are well suited for living rooms, lounges, offices, cabins, libraries, cafes, villas, and interiors where natural-looking finishes are important. Unlike fabric curtains, wooden blinds use horizontal slats that can tilt for privacy and light control while still maintaining a tailored look.",
      "Signature Drapes wooden blinds are useful when the interior needs a richer finish than a plain roller blind but a cleaner appearance than heavy curtains. They pair well with wood furniture, neutral walls, leather seating, classic interiors, and contemporary spaces that need a warm accent."
    ],
    benefits: [
      "Adds warmth and premium character to windows.",
      "Slats tilt for privacy and daylight control.",
      "Pairs well with wooden furniture and neutral interior palettes.",
      "Useful for cabins, living rooms, lounges, and premium office spaces."
    ],
    buyingGuide: [
      "Choose wooden blinds where design impact matters along with function. Consider slat color, width, room humidity, sunlight exposure, and how often the blind will be adjusted.",
      "For high-moisture areas, confirm whether a PVC or faux-wood option would be more practical. For dry living spaces and cabins, wooden-look finishes can create a premium statement.",
      "Measure carefully because horizontal blinds need clear movement space. Check if the window opens inward and whether handles or grills interfere with the slats."
    ],
    applications: [
      "Living rooms, office cabins, villas, cafes, study rooms, lounges, meeting rooms, and boutique commercial interiors.",
      "Useful when the window treatment should look warm, structured, and premium."
    ],
    customization: "Wooden blinds can be customized by slat finish, width, height, control side, ladder tape option, and mounting style. Color should coordinate with flooring, furniture, and wall tone.",
    installation: "Installation should keep the headrail level and allow slats to tilt freely. Outside mounting can improve coverage, while inside mounting gives a cleaner architectural finish when the recess is deep enough.",
    faqs: [
      {
        question: "Are wooden blinds suitable for offices?",
        answer: "Yes. Wooden blinds work very well in office cabins, meeting rooms, and reception spaces where a premium but controlled look is needed."
      },
      {
        question: "Can wooden blinds be used in kitchens?",
        answer: "For kitchens or humid areas, a PVC or faux-wood blind is usually easier to maintain than natural wood."
      }
    ],
    relatedLinks: [
      { label: "PVC Blinds", path: "/category/pvc-wooden-window-blinds?subcategory=pvc-blinds" },
      { label: "Curtains", path: "/category/curtains-and-accessories" },
      { label: "Roller Blinds", path: "/category/window-blinds?subcategory=roller-blinds" },
      { label: "Flooring", path: "/category/pvc-flooring" }
    ]
  },
  "pvc-blinds": {
    key: "pvc-blinds",
    h1: "PVC Blinds for Durable, Easy-Maintenance Windows",
    intro: [
      "PVC blinds are a practical choice for windows that need durability, moisture resistance, and easy cleaning. They are often selected for kitchens, bathrooms, balconies, rental homes, offices, clinics, and utility areas where fabric may collect dust or moisture. PVC blinds provide a structured look and can be adjusted for privacy and light control through tilting slats.",
      "Signature Drapes PVC blinds are designed for customers who want a neat window solution without delicate maintenance. They are useful in Indian conditions where dust, humidity, and daily handling can affect softer materials."
    ],
    benefits: [
      "Easy to clean and practical for dust-prone spaces.",
      "More moisture-friendly than many fabric window coverings.",
      "Adjustable slats help control privacy and daylight.",
      "Good for kitchens, balconies, bathrooms, offices, and rental properties."
    ],
    buyingGuide: [
      "Choose PVC blinds when maintenance and durability are the main priorities. Check slat thickness, color, control mechanism, and whether the blind will be exposed to moisture or direct sunlight.",
      "Light colors can keep a compact room brighter, while darker shades create stronger contrast and privacy. For high-traffic spaces, choose finishes that can be wiped regularly.",
      "Measure the window carefully and decide whether an inside or outside mount will cover gaps better."
    ],
    applications: [
      "Kitchens, balconies, utility rooms, bathrooms with ventilation, offices, schools, clinics, rental homes, and commercial spaces.",
      "Useful for practical light control in spaces that need frequent cleaning."
    ],
    customization: "PVC blinds can be customized by width, height, slat color, control side, and mount type. For large windows, separate sections can be easier to use and maintain.",
    installation: "Check wall strength, handle projection, grill position, and moisture exposure before installation. The blind should be mounted level so slats tilt evenly and lift smoothly.",
    faqs: [
      {
        question: "Are PVC blinds easy to clean?",
        answer: "Yes. PVC blinds can usually be wiped with a soft cloth, which makes them practical for kitchens, balconies, and dusty areas."
      },
      {
        question: "Are PVC blinds good for humid areas?",
        answer: "PVC blinds are generally more moisture-friendly than many fabric options, but installation should still allow ventilation and easy cleaning."
      }
    ],
    relatedLinks: [
      { label: "Wooden Blinds", path: "/category/pvc-wooden-window-blinds?subcategory=wooden-blinds" },
      { label: "Roller Blinds", path: "/category/window-blinds?subcategory=roller-blinds" },
      { label: "Curtains", path: "/category/curtains-and-accessories" },
      { label: "PVC Flooring", path: "/category/pvc-flooring" }
    ]
  },
  wallpaper: {
    key: "wallpaper",
    h1: "Wallpapers and Wall Coverings for Feature Walls and Interior Makeovers",
    intro: [
      "Wallpaper is one of the fastest ways to change the personality of a room without major civil work. It can create a feature wall, add texture, hide visual flatness, and connect furniture with the overall color palette. Signature Drapes offers wallpaper and wall covering options for bedrooms, living rooms, kids rooms, offices, shops, salons, cafes, and commercial interiors.",
      "A good wallpaper choice depends on wall condition, lighting, room size, design scale, cleaning needs, and how long the customer wants the finish to last. Subtle textures can make a premium room feel calm, while bold patterns can create a statement wall behind a sofa, bed, reception desk, or display area."
    ],
    benefits: [
      "Creates quick visual transformation without heavy renovation.",
      "Adds texture, pattern, and depth to plain walls.",
      "Useful for feature walls, commercial branding, and room zoning.",
      "Pairs well with curtains, blinds, flooring, and furniture upgrades."
    ],
    buyingGuide: [
      "Start with the wall where the wallpaper will be most visible. For small rooms, choose lighter textures or vertical patterns. For larger rooms, deeper colors or large patterns can work well.",
      "Check whether the wall has seepage, cracks, dust, or uneven paint. Wallpaper needs a stable surface for a clean finish. In high-touch areas, ask for materials that can be cleaned more easily.",
      "Coordinate wallpaper with curtains, blinds, flooring, and furniture. The best result comes when the wall finish supports the room design rather than competing with every other element."
    ],
    applications: [
      "Feature walls, bedrooms, living rooms, TV walls, kids rooms, offices, reception areas, cafes, boutiques, salons, and display zones.",
      "Useful when a room needs character, texture, or a premium backdrop."
    ],
    customization: "Wallpaper selection can be customized by pattern, texture, color family, wall size, and use case. Commercial spaces may need designs that match branding and lighting.",
    installation: "Wall preparation is critical. The surface should be dry, clean, smooth, and free from seepage. Professional installation helps pattern matching, edge finishing, and bubble-free application.",
    faqs: [
      {
        question: "Can wallpaper be applied on any wall?",
        answer: "Wallpaper works best on dry, smooth, prepared walls. Damp, flaky, or uneven walls should be repaired before installation."
      },
      {
        question: "Is wallpaper suitable for rented homes?",
        answer: "Some self-adhesive options may suit temporary use, but the right choice depends on wall paint quality and how easily removal is required."
      }
    ],
    relatedLinks: [
      { label: "Curtains", path: "/category/curtains-and-accessories" },
      { label: "Zebra Blinds", path: "/category/window-blinds?subcategory=zebra-blinds" },
      { label: "Flooring", path: "/category/pvc-flooring" },
      { label: "Artificial Grass", path: "/category/artificial-grass-plant-vertical-garden?subcategory=lawn-grass" }
    ]
  },
  "artificial-grass": {
    key: "artificial-grass",
    h1: "Artificial Grass for Balconies, Gardens, Terraces, and Indoor Green Corners",
    intro: [
      "Artificial grass is a low-maintenance way to add a green, comfortable, and finished look to balconies, terraces, gardens, play areas, display zones, and indoor corners. It is especially useful where natural grass is difficult to maintain because of limited sunlight, water restrictions, dust, or heavy daily use. Signature Drapes offers artificial lawn grass solutions for homes, offices, retail spaces, schools, and commercial projects.",
      "The right artificial grass should match the use case. A balcony may need soft grass with good drainage and easy cleaning, while a commercial display area may need a denser, more premium look. For children or pets, comfort and maintenance are important. For terrace or outdoor areas, backing, drainage, heat exposure, and installation method matter."
    ],
    benefits: [
      "Adds greenery without watering, mowing, or regular garden maintenance.",
      "Works for balconies, terraces, indoor corners, and display spaces.",
      "Creates a softer surface for casual seating or play zones.",
      "Pairs well with artificial plants, vertical gardens, outdoor furniture, and decor lighting."
    ],
    buyingGuide: [
      "Check pile height, density, backing quality, drainage, softness, and where the grass will be installed. Higher pile can look lush, while shorter grass can be easier to clean in high-use areas.",
      "For balconies and terraces, drainage is important so water does not collect below the grass. For indoor use, comfort and appearance may matter more than drainage.",
      "Measure the area accurately and consider wastage around corners, pipes, steps, and edges. Proper joining and edge finishing make a big difference to the final look."
    ],
    applications: [
      "Balconies, terraces, gardens, play areas, pet corners, office break zones, retail displays, schools, event setups, and vertical garden combinations.",
      "Useful for adding greenery in spaces where natural grass is not practical."
    ],
    customization: "Artificial grass can be selected by pile height, density, shade, roll size, and installation area. It can also be combined with vertical gardens, planters, pebbles, and outdoor seating.",
    installation: "The surface should be cleaned, leveled, and planned for drainage. Outdoor installations need edge fixing and joint alignment so the grass stays stable during use and cleaning.",
    faqs: [
      {
        question: "Is artificial grass good for balconies?",
        answer: "Yes. Artificial grass is commonly used on balconies because it creates a green look with low maintenance. Drainage and cleaning access should be planned."
      },
      {
        question: "Does artificial grass need watering?",
        answer: "No. It does not need watering like natural grass, but it should be cleaned periodically to remove dust and maintain freshness."
      }
    ],
    relatedLinks: [
      { label: "Vertical Gardens", path: "/category/artificial-grass-plant-vertical-garden?subcategory=vertical-gardens" },
      { label: "Artificial Plants", path: "/category/artificial-grass-plant-vertical-garden?subcategory=artificial-plants" },
      { label: "Outdoor Curtains", path: "/category/curtains-and-accessories" },
      { label: "PVC Flooring", path: "/category/pvc-flooring" }
    ]
  },
  flooring: {
    key: "flooring",
    h1: "PVC Flooring and Floor Solutions for Homes and Commercial Interiors",
    intro: [
      "Flooring changes how a room feels underfoot and how the entire interior is perceived. PVC flooring and related floor solutions are practical for customers who want a durable, easy-maintenance, and design-friendly surface without the disruption of heavier flooring work. Signature Drapes offers flooring options for homes, offices, shops, clinics, schools, rental properties, and commercial projects.",
      "The right flooring should be selected based on foot traffic, cleaning routine, moisture exposure, furniture movement, existing floor condition, and desired design. Wood-look finishes can warm up a room, stone-look finishes can feel more premium, and simple neutral floors can make compact interiors look cleaner."
    ],
    benefits: [
      "Practical for quick interior upgrades and commercial use.",
      "Available in designs that complement curtains, blinds, wallpapers, and furniture.",
      "Easier to maintain than many delicate floor finishes.",
      "Useful for rental homes, offices, retail spaces, clinics, and schools."
    ],
    buyingGuide: [
      "Start by understanding the subfloor. Uneven, damp, or damaged surfaces may need preparation before installation. A clean base helps the flooring look better and last longer.",
      "Choose thickness, finish, and design based on usage. High-traffic commercial areas need more durable options, while bedrooms and living rooms can prioritize comfort and design.",
      "Coordinate flooring with wall color, wallpaper, curtains, and furniture. Flooring covers a large visual area, so even a small color mismatch can affect the room."
    ],
    applications: [
      "Bedrooms, living rooms, offices, retail stores, clinics, classrooms, rental flats, corridors, and renovation projects.",
      "Useful where customers need a clean new floor look with practical installation and maintenance."
    ],
    customization: "Flooring choices can be customized by design, thickness, finish, installation area, and usage requirement. Commercial projects may need stronger wear behavior and simpler maintenance.",
    installation: "The existing surface should be dry, clean, and level. Door clearance, skirting, furniture movement, and edge finishing should be checked before installation begins.",
    faqs: [
      {
        question: "Is PVC flooring suitable for offices?",
        answer: "Yes. PVC flooring is often suitable for offices because it is practical, design-friendly, and easier to maintain than many delicate floor finishes."
      },
      {
        question: "Does flooring installation need surface preparation?",
        answer: "Yes. A dry, clean, and level surface gives a better finish and helps avoid visible imperfections after installation."
      }
    ],
    relatedLinks: [
      { label: "Wallpapers", path: "/category/home-decor-wallpaper-stickers" },
      { label: "Curtains", path: "/category/curtains-and-accessories" },
      { label: "Carpets and Rugs", path: "/category/carpet-rugs-door-mats" },
      { label: "Artificial Grass", path: "/category/artificial-grass-plant-vertical-garden?subcategory=lawn-grass" }
    ]
  }
};

export const getCategorySeoContentKey = (categoryId?: string, subcategoryId?: string) => {
  if (subcategoryId === "lawn-grass") return "artificial-grass";
  if (subcategoryId && categorySeoContent[subcategoryId]) return subcategoryId;
  if (categoryId === "home-decor-wallpaper-stickers") return "wallpaper";
  if (categoryId === "artificial-grass-plant-vertical-garden") return "artificial-grass";
  if (categoryId === "pvc-flooring") return "flooring";
  if (categoryId && categorySeoContent[categoryId]) return categoryId;
  return undefined;
};

export const getCategorySeoContent = (categoryId?: string, subcategoryId?: string) => {
  const key = getCategorySeoContentKey(categoryId, subcategoryId);
  return key ? categorySeoContent[key] : undefined;
};
