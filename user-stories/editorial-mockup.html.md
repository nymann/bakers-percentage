<!-- The Perfect Bread - Planning View -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>The Editorial Kitchen - Planning State</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400&amp;family=Manrope:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "primary-dim": "#57514e",
                        "primary": "#635d5a",
                        "on-background": "#31332c",
                        "surface-variant": "#e2e3d9",
                        "on-secondary-fixed-variant": "#635a52",
                        "on-secondary-fixed": "#463e37",
                        "surface-container-high": "#e8e9e0",
                        "surface-bright": "#fbf9f4",
                        "surface": "#fbf9f4",
                        "outline-variant": "#b1b3a9",
                        "on-primary": "#fff6f1",
                        "surface-container-lowest": "#ffffff",
                        "on-tertiary-container": "#64523c",
                        "tertiary-fixed-dim": "#f0d6b9",
                        "on-surface": "#31332c",
                        "inverse-on-surface": "#9e9d99",
                        "on-tertiary-fixed-variant": "#6f5c45",
                        "surface-container": "#efeee6",
                        "secondary-fixed": "#ede0d6",
                        "primary-container": "#e9e1dc",
                        "error": "#9e422c",
                        "on-tertiary-fixed": "#51402b",
                        "tertiary-dim": "#62503a",
                        "on-error": "#fff7f6",
                        "on-primary-fixed": "#433e3b",
                        "secondary-dim": "#5a524a",
                        "secondary-container": "#ede0d6",
                        "outline": "#797c73",
                        "surface-tint": "#635d5a",
                        "tertiary-fixed": "#fee4c6",
                        "primary-fixed-dim": "#dbd3ce",
                        "surface-dim": "#d9dbcf",
                        "on-surface-variant": "#5e6058",
                        "background": "#fbf9f4",
                        "surface-container-highest": "#e2e3d9",
                        "secondary": "#665e55",
                        "on-primary-fixed-variant": "#605a57",
                        "on-primary-container": "#56514d",
                        "tertiary": "#6f5c45",
                        "on-error-container": "#742410",
                        "on-tertiary": "#fff7f3",
                        "error-dim": "#5c1202",
                        "primary-fixed": "#e9e1dc",
                        "inverse-surface": "#0e0e0c",
                        "tertiary-container": "#fee4c6",
                        "error-container": "#fe8b70",
                        "on-secondary": "#fff7f3",
                        "on-secondary-container": "#595048",
                        "surface-container-low": "#f5f4ed",
                        "inverse-primary": "#ffffff",
                        "secondary-fixed-dim": "#dfd2c8"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    "fontFamily": {
                        "headline": ["Noto Serif"],
                        "body": ["Manrope"],
                        "label": ["Manrope"]
                    }
                }
            }
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        .editorial-scroll::-webkit-scrollbar {
            width: 4px;
        }
        .editorial-scroll::-webkit-scrollbar-thumb {
            background: #b1b3a933;
        }
    </style>
</head>
<body class="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container">
<!-- TopAppBar Component -->
<header class="fixed top-0 w-full z-50 bg-[#fbf9f4] dark:bg-[#0e0e0c]">
<div class="flex justify-between items-center px-6 h-20 w-full max-w-screen-2xl mx-auto">
<div class="flex items-center gap-4">
<span class="text-2xl font-serif italic text-[#2D2926] dark:text-[#fbf9f4]">The Editorial Kitchen</span>
</div>
<nav class="hidden md:flex items-center gap-8 font-['Noto_Serif'] tracking-tight">
<a class="text-[#635d5a] border-b-2 border-[#635d5a] pb-1" href="#">Planning</a>
<a class="text-[#5e6058] hover:bg-[#f5f4ed] transition-colors px-2 py-1 rounded" href="#">Execution</a>
<a class="text-[#5e6058] hover:bg-[#f5f4ed] transition-colors px-2 py-1 rounded" href="#">History</a>
</nav>
<div class="flex items-center gap-4 text-[#635d5a]">
<span class="material-symbols-outlined cursor-pointer hover:opacity-80">timer</span>
<span class="material-symbols-outlined cursor-pointer hover:opacity-80">history</span>
<div class="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden">
<img class="w-full h-full object-cover" data-alt="portrait of a professional baker with a dusting of flour on his apron in a warm kitchen setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwZh0UUGrOWAu632v8MaPb8zW_-nZd3uvMRmuRrqeVViiFIK_Zye27ZVfATu-rcQMXwnsaXYAmCstiEZTMYIxaaIu82vV4s-eGYx_2b5P9wtfItrv9r7KeOb3K5bqRl4itaNlTffZWpDf3t_bkgrjMoY_47UIv5t5waextODSQwYexg6f7j44KziRHiqrdHLwa_iw5U5fVswtnK-J7mCXUpndR7wHvTYoUvJNc_Jo4F-JHKQi8wzFpzvPeLH2ipt58t72A6Lk-g0EM"/>
</div>
</div>
</div>
</header>
<div class="flex min-h-screen pt-20">
<!-- SideNavBar Component -->
<aside class="hidden lg:flex flex-col h-[calc(100vh-5rem)] sticky top-20 w-72 bg-[#e8e9e0] dark:bg-[#1a1a18] shadow-[20px_0_40px_rgba(49,51,44,0.05)] transition-all duration-200 ease-in-out">
<div class="p-8">
<div class="flex items-center gap-3 mb-10">
<div class="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center">
<span class="material-symbols-outlined text-primary">kitchen</span>
</div>
<div>
<h2 class="font-['Noto_Serif'] text-xl italic text-primary">The Kitchen</h2>
<p class="font-['Manrope'] uppercase tracking-widest text-[0.6rem] text-on-surface-variant">Master Baker</p>
</div>
</div>
<nav class="space-y-2">
<a class="flex items-center gap-3 py-3 text-[#5e6058] pl-5 hover:text-[#2D2926] hover:bg-[#f5f4ed]/50 rounded-r-xl transition-all font-['Manrope'] uppercase tracking-widest text-[0.75rem]" href="#">
<span class="material-symbols-outlined text-[20px]">menu_book</span> Journal
                    </a>
<a class="flex items-center gap-3 py-3 text-[#5e6058] pl-5 hover:text-[#2D2926] hover:bg-[#f5f4ed]/50 rounded-r-xl transition-all font-['Manrope'] uppercase tracking-widest text-[0.75rem]" href="#">
<span class="material-symbols-outlined text-[20px]">local_library</span> Library
                    </a>
<a class="flex items-center gap-3 py-3 text-[#2D2926] font-bold border-l-4 border-[#635d5a] pl-4 bg-[#f5f4ed]/30 rounded-r-xl font-['Manrope'] uppercase tracking-widest text-[0.75rem]" href="#">
<span class="material-symbols-outlined text-[20px]">kitchen</span> Pantry
                    </a>
<a class="flex items-center gap-3 py-3 text-[#5e6058] pl-5 hover:text-[#2D2926] hover:bg-[#f5f4ed]/50 rounded-r-xl transition-all font-['Manrope'] uppercase tracking-widest text-[0.75rem]" href="#">
<span class="material-symbols-outlined text-[20px]">groups</span> Community
                    </a>
</nav>
</div>
<div class="mt-auto p-6">
<button class="w-full py-4 bg-primary text-on-primary rounded-xl font-label tracking-widest uppercase text-xs hover:bg-primary-dim transition-colors">
                    New Batch
                </button>
</div>
</aside>
<!-- Main Content Canvas -->
<main class="flex-1 px-6 md:px-12 py-10 max-w-6xl mx-auto editorial-scroll overflow-y-auto">
<!-- Planning State Header -->
<header class="mb-12">
<span class="font-label text-primary uppercase tracking-[0.2em] text-[0.7rem] block mb-2">Recipe Configuration</span>
<h1 class="font-headline text-5xl text-on-surface leading-tight mb-4 italic">The Artisan Sourdough Ledger</h1>
<p class="font-body text-on-surface-variant max-w-xl leading-relaxed">Adjust your parameters below. Our algorithm calculates precise ratios to ensure the perfect crumb, regardless of ambient temperature or batch scale.</p>
</header>
<div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
<!-- Configuration Controls (Asymmetric Layout) -->
<section class="md:col-span-7 space-y-12">
<!-- Bread Size Selector -->
<div>
<label class="font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant block mb-6">Volume &amp; Scale (Bread Size)</label>
<div class="flex gap-4">
<button class="flex-1 group relative p-6 bg-surface-container-low rounded-xl text-center hover:bg-surface-container transition-all">
<span class="block font-headline text-2xl mb-1 group-hover:italic transition-all text-on-surface">S</span>
<span class="block font-label text-[0.6rem] text-on-surface-variant uppercase tracking-tighter">500g Boule</span>
</button>
<button class="flex-1 group relative p-6 bg-primary text-on-primary rounded-xl text-center ring-4 ring-primary/10 transition-all">
<span class="block font-headline text-2xl mb-1 italic">M</span>
<span class="block font-label text-[0.6rem] uppercase tracking-tighter opacity-80">800g Batard</span>
</button>
<button class="flex-1 group relative p-6 bg-surface-container-low rounded-xl text-center hover:bg-surface-container transition-all">
<span class="block font-headline text-2xl mb-1 group-hover:italic transition-all text-on-surface">L</span>
<span class="block font-label text-[0.6rem] text-on-surface-variant uppercase tracking-tighter">1.2kg Miche</span>
</button>
</div>
</div>
<!-- Leavening Agent Selection -->
<div>
<label class="font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant block mb-6">Fermentation Path</label>
<div class="grid grid-cols-2 gap-4">
<div class="relative p-6 rounded-xl border-2 border-primary bg-surface-container-lowest flex items-start gap-4">
<span class="material-symbols-outlined text-primary text-3xl">eco</span>
<div>
<h4 class="font-headline text-lg leading-none mb-1">Sourdough</h4>
<p class="text-[0.7rem] text-on-surface-variant font-body leading-tight">Wild yeast, long ferment, deep complexity.</p>
</div>
</div>
<div class="relative p-6 rounded-xl border-2 border-transparent bg-surface-container-low flex items-start gap-4 hover:border-outline-variant/30 transition-all">
<span class="material-symbols-outlined text-on-surface-variant text-3xl">bubble_chart</span>
<div>
<h4 class="font-headline text-lg leading-none mb-1">Yeast</h4>
<p class="text-[0.7rem] text-on-surface-variant font-body leading-tight">Commercial yeast, predictable, quick rise.</p>
</div>
</div>
</div>
</div>
<!-- Prominent Time Selection Tool -->
<div class="p-8 bg-surface-container-high rounded-3xl relative overflow-hidden">
<div class="relative z-10">
<label class="font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant block mb-8 text-center">Desired Finish Time</label>
<div class="flex items-center justify-center gap-8 mb-8">
<div class="text-center">
<div class="font-headline text-6xl text-on-surface">08<span class="text-primary/30">:</span>45</div>
<span class="font-label text-[0.65rem] text-on-surface-variant tracking-[0.3em] uppercase">Sunday Morning</span>
</div>
</div>
<div class="px-4">
<input class="w-full h-1 bg-outline-variant/30 rounded-lg appearance-none cursor-pointer accent-primary" max="24" min="0" step="0.5" type="range"/>
<div class="flex justify-between mt-4 font-label text-[0.6rem] text-on-surface-variant uppercase tracking-tighter">
<span>Now</span>
<span>+12 Hours</span>
<span>+24 Hours</span>
<span>+48 Hours</span>
</div>
</div>
</div>
<div class="absolute -right-20 -bottom-20 opacity-5 pointer-events-none">
<span class="material-symbols-outlined text-[300px]" style="font-variation-settings: 'wght' 100;">schedule</span>
</div>
</div>
</section>
<!-- Ingredient Ledger & Timeline Preview -->
<section class="md:col-span-5 space-y-8 sticky top-28">
<!-- Calculated Formula Components (The Ledger) -->
<div class="bg-surface-container-lowest p-10 rounded-2xl shadow-[0_20px_40px_rgba(49,51,44,0.03)] border border-outline-variant/10">
<div class="flex justify-between items-end mb-8 border-b border-outline-variant/15 pb-4">
<h3 class="font-headline text-xl">The Formula</h3>
<span class="font-label text-xs text-primary">Hydration: 75%</span>
</div>
<div class="space-y-6">
<div class="flex justify-between items-center group">
<span class="font-body text-on-surface-variant">Bread Flour (T65)</span>
<div class="flex items-center gap-4">
<div class="h-[1px] w-12 bg-outline-variant/30 group-hover:w-20 transition-all"></div>
<span class="font-headline text-xl">450<span class="text-sm italic ml-1">g</span></span>
</div>
</div>
<div class="flex justify-between items-center group">
<span class="font-body text-on-surface-variant">Filtered Water</span>
<div class="flex items-center gap-4">
<div class="h-[1px] w-12 bg-outline-variant/30 group-hover:w-20 transition-all"></div>
<span class="font-headline text-xl">335<span class="text-sm italic ml-1">g</span></span>
</div>
</div>
<div class="flex justify-between items-center group">
<span class="font-body text-on-surface-variant">Active Starter</span>
<div class="flex items-center gap-4">
<div class="h-[1px] w-12 bg-outline-variant/30 group-hover:w-20 transition-all"></div>
<span class="font-headline text-xl">90<span class="text-sm italic ml-1">g</span></span>
</div>
</div>
<div class="flex justify-between items-center group">
<span class="font-body text-on-surface-variant">Sea Salt</span>
<div class="flex items-center gap-4">
<div class="h-[1px] w-12 bg-outline-variant/30 group-hover:w-20 transition-all"></div>
<span class="font-headline text-xl">11<span class="text-sm italic ml-1">g</span></span>
</div>
</div>
</div>
<div class="mt-12 pt-6 border-t border-dashed border-outline-variant/40">
<div class="flex justify-between items-center">
<span class="font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant">Total Dough Weight</span>
<span class="font-headline text-2xl text-primary">886<span class="text-sm italic ml-1">g</span></span>
</div>
</div>
</div>
<!-- Baking Arc Preview (Timeline) -->
<div class="p-6 bg-surface-container-low rounded-2xl">
<label class="font-label text-[0.65rem] uppercase tracking-widest text-on-surface-variant block mb-4">Estimated Arc</label>
<div class="space-y-4">
<div class="flex items-center gap-3">
<div class="w-2 h-2 rounded-full bg-primary"></div>
<span class="text-xs font-body text-on-surface">Autolyse <span class="text-on-surface-variant italic ml-1">Today, 4:00 PM</span></span>
</div>
<div class="flex items-center gap-3">
<div class="w-2 h-2 rounded-full bg-outline-variant/50"></div>
<span class="text-xs font-body text-on-surface-variant">Bulk Ferment <span class="italic ml-1">Today, 6:30 PM</span></span>
</div>
<div class="flex items-center gap-3">
<div class="w-2 h-2 rounded-full bg-outline-variant/50"></div>
<span class="text-xs font-body text-on-surface-variant">Cold Proof <span class="italic ml-1">Tonight, 11:00 PM</span></span>
</div>
<div class="flex items-center gap-3 opacity-60">
<div class="w-2 h-2 rounded-full border border-outline-variant"></div>
<span class="text-xs font-body text-on-surface-variant">Bake <span class="italic ml-1">Tomorrow, 8:00 AM</span></span>
</div>
</div>
<button class="mt-6 w-full py-3 border border-outline-variant/20 rounded-lg font-label text-[0.65rem] tracking-[0.2em] uppercase hover:bg-surface-container transition-all">
                            View Detailed Schedule
                        </button>
</div>
</section>
</div>
<!-- Contextual CTA -->
<div class="mt-16 flex justify-center pb-32">
<button class="group flex items-center gap-4 px-12 py-5 bg-primary text-on-primary rounded-full hover:scale-105 transition-transform duration-300">
<span class="font-label text-sm tracking-[0.25em] uppercase">Confirm &amp; Begin Batch</span>
<span class="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
</button>
</div>
</main>
</div>
<!-- BottomNavBar Component (Mobile Only) -->
<nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-4 lg:hidden bg-[#fbf9f4]/70 dark:bg-[#0e0e0c]/70 backdrop-blur-xl z-50 rounded-t-3xl shadow-[0_-10px_30px_rgba(49,51,44,0.03)] border-t border-[#b1b3a9]/15">
<a class="flex flex-col items-center justify-center bg-[#635d5a] text-[#fff6f1] rounded-xl px-6 py-2 transition-transform duration-150 scale-95" href="#">
<span class="material-symbols-outlined">edit_note</span>
<span class="font-['Manrope'] text-[10px] font-medium uppercase tracking-tighter mt-1">Planning</span>
</a>
<a class="flex flex-col items-center justify-center text-[#5e6058] px-6 py-2 hover:text-[#635d5a] transition-transform duration-150" href="#">
<span class="material-symbols-outlined">play_circle</span>
<span class="font-['Manrope'] text-[10px] font-medium uppercase tracking-tighter mt-1">Execution</span>
</a>
<a class="flex flex-col items-center justify-center text-[#5e6058] px-6 py-2 hover:text-[#635d5a] transition-transform duration-150" href="#">
<span class="material-symbols-outlined">calendar_today</span>
<span class="font-['Manrope'] text-[10px] font-medium uppercase tracking-tighter mt-1">History</span>
</a>
</nav>
</body></html>

<!-- The Perfect Bread - Execution View -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400&amp;family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "primary-dim": "#57514e",
                    "primary": "#635d5a",
                    "on-background": "#31332c",
                    "surface-variant": "#e2e3d9",
                    "on-secondary-fixed-variant": "#635a52",
                    "on-secondary-fixed": "#463e37",
                    "surface-container-high": "#e8e9e0",
                    "surface-bright": "#fbf9f4",
                    "surface": "#fbf9f4",
                    "outline-variant": "#b1b3a9",
                    "on-primary": "#fff6f1",
                    "surface-container-lowest": "#ffffff",
                    "on-tertiary-container": "#64523c",
                    "tertiary-fixed-dim": "#f0d6b9",
                    "on-surface": "#31332c",
                    "inverse-on-surface": "#9e9d99",
                    "on-tertiary-fixed-variant": "#6f5c45",
                    "surface-container": "#efeee6",
                    "secondary-fixed": "#ede0d6",
                    "primary-container": "#e9e1dc",
                    "error": "#9e422c",
                    "on-tertiary-fixed": "#51402b",
                    "tertiary-dim": "#62503a",
                    "on-error": "#fff7f6",
                    "on-primary-fixed": "#433e3b",
                    "secondary-dim": "#5a524a",
                    "secondary-container": "#ede0d6",
                    "outline": "#797c73",
                    "surface-tint": "#635d5a",
                    "tertiary-fixed": "#fee4c6",
                    "primary-fixed-dim": "#dbd3ce",
                    "surface-dim": "#d9dbcf",
                    "on-surface-variant": "#5e6058",
                    "background": "#fbf9f4",
                    "surface-container-highest": "#e2e3d9",
                    "secondary": "#665e55",
                    "on-primary-fixed-variant": "#605a57",
                    "on-primary-container": "#56514d",
                    "tertiary": "#6f5c45",
                    "on-error-container": "#742410",
                    "on-tertiary": "#fff7f3",
                    "error-dim": "#5c1202",
                    "primary-fixed": "#e9e1dc",
                    "inverse-surface": "#0e0e0c",
                    "tertiary-container": "#fee4c6",
                    "error-container": "#fe8b70",
                    "on-secondary": "#fff7f3",
                    "on-secondary-container": "#595048",
                    "surface-container-low": "#f5f4ed",
                    "inverse-primary": "#ffffff",
                    "secondary-fixed-dim": "#dfd2c8"
            },
            "borderRadius": {
                    "DEFAULT": "0.125rem",
                    "lg": "0.25rem",
                    "xl": "0.5rem",
                    "full": "0.75rem"
            },
            "fontFamily": {
                    "headline": ["Noto Serif"],
                    "body": ["Manrope"],
                    "label": ["Manrope"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        .baking-arc-line::before {
            content: '';
            position: absolute;
            left: 1.25rem;
            top: 2rem;
            bottom: 0;
            width: 1px;
            background: #b1b3a966;
        }
        .glass-panel {
            background: rgba(251, 249, 244, 0.7);
            backdrop-filter: blur(12px);
        }
    </style>
</head>
<body class="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-[#fbf9f4] dark:bg-[#0e0e0c] flex justify-between items-center px-6 h-20 w-full max-w-screen-2xl mx-auto">
<div class="text-2xl font-serif italic text-[#2D2926] dark:text-[#fbf9f4]">The Editorial Kitchen</div>
<nav class="hidden md:flex gap-8">
<a class="font-['Noto_Serif'] tracking-tight text-[#635d5a] border-b-2 border-[#635d5a] hover:bg-[#f5f4ed] transition-colors" href="#">Execution</a>
<a class="font-['Noto_Serif'] tracking-tight text-[#5e6058] hover:bg-[#f5f4ed] transition-colors" href="#">Planning</a>
<a class="font-['Noto_Serif'] tracking-tight text-[#5e6058] hover:bg-[#f5f4ed] transition-colors" href="#">History</a>
</nav>
<div class="flex items-center gap-4 text-[#635d5a]">
<span class="material-symbols-outlined cursor-pointer hover:bg-[#f5f4ed] p-2 rounded-full transition-colors" data-icon="timer">timer</span>
<span class="material-symbols-outlined cursor-pointer hover:bg-[#f5f4ed] p-2 rounded-full transition-colors" data-icon="history">history</span>
<div class="w-8 h-8 rounded-full bg-surface-container overflow-hidden">
<img alt="User profile" data-alt="Close-up portrait of a professional chef in a white apron, warm natural lighting, soft focused kitchen background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM44SmhCfnMXPuKGQFmJovbLU1b9pzDg47j94M6_MrB82iZIrO4Mp10w0vVl5vyedWTi1T1w8S4z7KEVUYAJSJXKv4KcM5EkV2G-vj_Ymi0OcdvNax9s76R5rDyu17Z1XBrRr5CZEpKgX40hAzrzDAHumRnatWUvtWqR9n93F8hbZA2B4YA-KzNh7o3jmvr4i3qDZGUPZasnwmVf0CwpzUBQkzikabqzd9ycHXza7rCrpV6cPAYSdwmileq6oFnzZl_8sdqn_-qqn8"/>
</div>
</div>
</header>
<div class="flex min-h-screen pt-20">
<!-- SideNavBar -->
<aside class="hidden lg:flex flex-col h-[calc(100vh-5rem)] sticky top-20 w-72 bg-[#e8e9e0] dark:bg-[#1a1a18] shadow-[20px_0_40px_rgba(49,51,44,0.05)]">
<div class="p-8 space-y-2">
<div class="font-['Noto_Serif'] text-xl italic text-[#635d5a]">The Kitchen</div>
<div class="font-['Manrope'] uppercase tracking-widest text-[0.75rem] text-on-surface-variant opacity-70">Master Baker</div>
</div>
<nav class="flex-1 px-3 space-y-1">
<a class="flex items-center gap-4 py-3 font-['Manrope'] uppercase tracking-widest text-[0.75rem] text-[#5e6058] pl-5 hover:text-[#2D2926] hover:bg-[#f5f4ed]/50 transition-all duration-200 ease-in-out" href="#">
<span class="material-symbols-outlined text-lg" data-icon="menu_book">menu_book</span> Journal
                </a>
<a class="flex items-center gap-4 py-3 font-['Manrope'] uppercase tracking-widest text-[0.75rem] text-[#5e6058] pl-5 hover:text-[#2D2926] hover:bg-[#f5f4ed]/50 transition-all duration-200 ease-in-out" href="#">
<span class="material-symbols-outlined text-lg" data-icon="local_library">local_library</span> Library
                </a>
<a class="flex items-center gap-4 py-3 font-['Manrope'] uppercase tracking-widest text-[0.75rem] text-[#5e6058] pl-5 hover:text-[#2D2926] hover:bg-[#f5f4ed]/50 transition-all duration-200 ease-in-out" href="#">
<span class="material-symbols-outlined text-lg" data-icon="kitchen">kitchen</span> Pantry
                </a>
<a class="flex items-center gap-4 py-3 font-['Manrope'] uppercase tracking-widest text-[0.75rem] text-[#5e6058] pl-5 hover:text-[#2D2926] hover:bg-[#f5f4ed]/50 transition-all duration-200 ease-in-out" href="#">
<span class="material-symbols-outlined text-lg" data-icon="groups">groups</span> Community
                </a>
</nav>
<div class="p-6 border-t border-outline-variant/10">
<div class="bg-surface-container-low p-6 rounded-xl space-y-4">
<div class="text-[0.65rem] font-bold uppercase tracking-widest text-on-surface-variant">Active Batch</div>
<div class="font-headline italic text-lg text-primary">Classic Country Sourdough</div>
<div class="flex items-center gap-2 text-label text-on-surface-variant">
<span class="material-symbols-outlined text-sm" data-icon="schedule">schedule</span>
<span>04:45 Remaining</span>
</div>
</div>
</div>
</aside>
<!-- Main Content: Execution Canvas -->
<main class="flex-1 flex flex-col md:flex-row gap-8 p-6 md:p-12 overflow-x-hidden">
<!-- Baking Arc Timeline -->
<div class="flex-1 max-w-4xl relative">
<div class="mb-12">
<h1 class="font-headline text-5xl text-on-surface mb-2 tracking-tight">Current Batch Arc</h1>
<p class="font-body text-on-surface-variant italic">Started today at 08:30 AM — Batch #422</p>
</div>
<div class="space-y-12 relative baking-arc-line">
<!-- Step 1: Completed -->
<div class="relative pl-12 group">
<div class="absolute left-0 top-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center z-10 text-on-primary">
<span class="material-symbols-outlined" data-icon="check">check</span>
</div>
<div class="opacity-60 transition-opacity group-hover:opacity-100">
<div class="flex items-center gap-4 mb-2">
<span class="text-label text-on-surface-variant uppercase tracking-widest">08:30 AM — Done</span>
<h3 class="font-headline text-2xl italic">Autolyse</h3>
</div>
<p class="font-body text-on-surface-variant max-w-lg">Mixed bread flour and whole wheat with 80% hydration. Allowed to rest for 60 minutes to develop gluten structure naturally.</p>
</div>
</div>
<!-- Step 2: Active -->
<div class="relative pl-12">
<div class="absolute left-0 top-0 w-10 h-10 rounded-full bg-tertiary-container border-2 border-tertiary flex items-center justify-center z-10 text-on-tertiary-container shadow-xl">
<span class="material-symbols-outlined animate-pulse" data-icon="play_circle">play_circle</span>
</div>
<div class="bg-surface-container-lowest p-8 rounded-2xl shadow-[0_20px_40px_rgba(49,51,44,0.05)] border border-outline-variant/10">
<div class="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
<div>
<div class="flex items-center gap-4 mb-2">
<span class="text-label text-tertiary font-bold uppercase tracking-widest">In Progress</span>
<h3 class="font-headline text-3xl">Bulk Fermentation</h3>
</div>
<p class="font-body text-on-surface text-lg">Watch for 30-50% volume increase and active bubbling on the surface.</p>
</div>
<!-- Baker's Timer Component -->
<div class="flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-tertiary relative bg-surface-container-low">
<span class="font-headline text-2xl font-bold">22:14</span>
<span class="text-[0.6rem] uppercase tracking-tighter text-on-surface-variant">Remaining</span>
</div>
</div>
<div class="space-y-4 pt-6 border-t border-outline-variant/15">
<label class="flex items-center gap-4 cursor-pointer group">
<input checked="" class="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary-container" type="checkbox"/>
<span class="font-body text-on-surface-variant group-hover:text-on-surface transition-colors line-through">First Fold (Initial strength)</span>
</label>
<label class="flex items-center gap-4 cursor-pointer group">
<input checked="" class="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary-container" type="checkbox"/>
<span class="font-body text-on-surface-variant group-hover:text-on-surface transition-colors line-through">Second Fold (Lamination)</span>
</label>
<label class="flex items-center gap-4 cursor-pointer group">
<input class="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary-container" type="checkbox"/>
<span class="font-body text-on-surface group-hover:text-primary transition-colors font-semibold">Third Fold (Coil fold)</span>
</label>
</div>
</div>
</div>
<!-- Step 3: Upcoming -->
<div class="relative pl-12 opacity-40">
<div class="absolute left-0 top-0 w-10 h-10 rounded-full bg-surface-container-high border-2 border-outline-variant/30 flex items-center justify-center z-10 text-on-surface-variant">
<span class="material-symbols-outlined" data-icon="lock">lock</span>
</div>
<div>
<div class="flex items-center gap-4 mb-2">
<span class="text-label text-on-surface-variant uppercase tracking-widest">Estimated 1:30 PM</span>
<h3 class="font-headline text-2xl italic">Preshape &amp; Bench Rest</h3>
</div>
<p class="font-body text-on-surface-variant max-w-lg">Gently divide the dough and form into rounds. Rest uncovered for 30 minutes to form a slight skin.</p>
</div>
</div>
</div>
</div>
<!-- Side Panel: Configuration & Details -->
<aside class="w-full md:w-80 space-y-8">
<!-- Collapsed Configuration -->
<div class="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
<div class="flex items-center justify-between mb-6">
<h4 class="font-label uppercase tracking-widest text-[0.7rem] font-bold text-on-surface">Configuration</h4>
<button class="text-primary text-xs font-bold uppercase hover:underline">Edit</button>
</div>
<div class="space-y-4">
<div class="flex justify-between items-center text-sm">
<span class="text-on-surface-variant">Target Hydration</span>
<span class="font-mono font-bold">82%</span>
</div>
<div class="flex justify-between items-center text-sm">
<span class="text-on-surface-variant">Room Temp</span>
<span class="font-mono font-bold">24°C</span>
</div>
<div class="flex justify-between items-center text-sm">
<span class="text-on-surface-variant">Flour Blend</span>
<span class="font-mono font-bold">T80 / WW</span>
</div>
</div>
</div>
<!-- Instructional Image / Visual Guide -->
<div class="rounded-2xl overflow-hidden aspect-square shadow-lg relative group">
<img alt="Bulk fermentation texture" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" data-alt="Close-up of aerated sourdough dough in a glass bowl showing large fermentation bubbles and silky texture, natural window light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwaRs2W1nhpYOpNQevZCGjSBFQkM8G7OTriGn2-RdSkVaNqS8nHZrzSJ95r7W1sNiL_bga0zb4LWSV0ivl-W4jPvCkcUeWJbzp9zuS50Hs2YrjvoIDLsa1c8YAKNSMyu_8n_K28zl_8CE0Rm2ktwlpFbb-FEPAO4TtxHH8TsbUY529VIA90Ih2-TRwQUaS9QETQG6yO16ZedVMGgkkrDraeBFuwTPSuiUyQt9fH_NWy1HWd9-rdAn9PRj6fWJNS5WxAEdOvOlgVpjx"/>
<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
<span class="text-white text-xs font-bold uppercase tracking-widest">Visual Reference: Fermentation Peak</span>
</div>
</div>
<!-- Baker's Log Note -->
<div class="bg-surface-container-highest p-6 rounded-2xl italic font-serif text-on-tertiary-container relative">
<span class="material-symbols-outlined absolute -top-3 -left-3 bg-tertiary text-on-primary rounded-full p-1 text-sm" data-icon="edit">edit</span>
                    "The starter was exceptionally active this morning. Reduced initial water by 10g to compensate for higher humidity."
                </div>
</aside>
</main>
</div>
<!-- BottomNavBar (Mobile Only) -->
<nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-4 lg:hidden bg-[#fbf9f4]/70 dark:bg-[#0e0e0c]/70 backdrop-blur-xl z-50 rounded-t-3xl border-t border-[#b1b3a9]/15 shadow-[0_-10px_30px_rgba(49,51,44,0.03)]">
<div class="flex flex-col items-center justify-center text-[#5e6058] px-6 py-2 scale-95 transition-transform duration-150 hover:text-[#635d5a]">
<span class="material-symbols-outlined" data-icon="edit_note">edit_note</span>
<span class="font-['Manrope'] text-[10px] font-medium uppercase tracking-tighter">Planning</span>
</div>
<div class="flex flex-col items-center justify-center bg-[#635d5a] text-[#fff6f1] rounded-xl px-6 py-2 scale-95 transition-transform duration-150">
<span class="material-symbols-outlined" data-icon="play_circle" style="font-variation-settings: 'FILL' 1;">play_circle</span>
<span class="font-['Manrope'] text-[10px] font-medium uppercase tracking-tighter">Execution</span>
</div>
<div class="flex flex-col items-center justify-center text-[#5e6058] px-6 py-2 scale-95 transition-transform duration-150 hover:text-[#635d5a]">
<span class="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
<span class="font-['Manrope'] text-[10px] font-medium uppercase tracking-tighter">History</span>
</div>
</nav>
</body></html>
