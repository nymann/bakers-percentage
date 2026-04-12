It is incredibly exciting to bridge the gap between artisanal baking and applied microbiology. Modeling sourdough fermentation mathematically is a known discipline within food science called **predictive microbiology**.

When you want to model fermentation based on starter percentage, hydration, and temperature, you are essentially trying to predict the growth kinetics of yeast and lactic acid bacteria (LAB) in a dough matrix.

Here is a breakdown of the key research papers that tackle this, followed by a guide on how you can structure your own mathematical model based on their findings.

---

### **Key Research Papers on Sourdough Modeling**

To build an accurate model, you will want to look at how food scientists map out the specific growth rates of the microbes in your starter. Here are three foundational and modern papers that study the exact parameters you are interested in:

1.  **The Classic Baseline Model:** Gänzle et al. (1998) is a foundational paper that modeled the growth of common sourdough LAB (_Lactobacillus sanfranciscensis_) and yeast (_Candida milleri_). They specifically looked at how temperature and ionic strength (which relates to hydration and salt) affect the growth rates and metabolic outputs of the starter.
2.  **Modern Liquid Sourdough Kinetics:** Di Biase et al. (2022) provides a highly relevant, modern framework. They used mathematical modeling to predict how a specific LAB strain behaves during fermentation based on temperature and water activity (hydration). They specifically utilized logistic models to map out how long it takes for the dough to reach peak acidity.
3.  **Temperature and Backslopping Times:** Vrancken et al. (2011) explored how different temperature environments alter the dominant microorganisms in the dough. This is crucial if you are modeling room temperature versus cold retardation (the fridge), as the temperature doesn't just change the _speed_ of fermentation; it fundamentally changes _which_ microbes are doing the work.

---

### **How to Build Your Mathematical Model**

If you want to build a calculator or a simulation for your dough, you will need to combine a **primary model** (which predicts how the dough rises over time) with **secondary models** (which adjust the speed based on your specific baking environment).

[Image of microbial growth curve]

#### **1. The Primary Model: Amount of Starter**

To model the actual rise of the dough, you would typically use a logistic growth equation. The amount of starter you use represents the initial microbial load.

$$N(t) = \frac{N_{max}}{1 + \left( \frac{N_{max}}{N_0} - 1 \right) e^{-\mu_{max} t}}$$

- $N(t)$ = The volume of the dough at a given time $t$.
- $N_{max}$ = The maximum capacity (how much the dough can rise before the food runs out or the gluten degrades).
- $N_0$ = **Your starter percentage.** Increasing the starter percentage increases $N_0$, meaning the dough reaches $N_{max}$ much faster (Di Biase et al., 2022).
- $\mu_{max}$ = The maximum growth rate of the yeast and bacteria.

#### **2. The Secondary Model: Temperature (Room vs. Fridge)**

Temperature alters the $\mu_{max}$ variable in the equation above. To model the difference between a room temperature proof and a fridge retardation, you can use the Ratkowsky square root model:

$$\sqrt{\mu_{max}} = b(T - T_{min})$$

- $T$ = Your proofing temperature.
- $T_{min}$ = The minimum temperature at which the microbes can grow.
- $b$ = A constant specific to the microbes.

Because a fridge is usually around 4°C, it approaches the $T_{min}$ for wild yeast, causing their growth rate ($\mu_{max}$) to drop to near zero. However, certain LABs have a slightly lower $T_{min}$, which is why dough continues to sour in the fridge even when it stops rising (Vrancken et al., 2011).

#### **3. The Secondary Model: Hydration Percentage**

Hydration dictates the "water activity" ($a_w$) of the dough matrix. Higher hydration allows for greater microbial mobility and faster enzymatic activity. This also modifies the growth rate $\mu_{max}$:

$$\mu_{max}(a_w) \propto \sqrt{a_w - a_{w,min}}$$

Drier doughs (stiff starters or low hydration bagels) have lower water activity, which suppresses the growth rate and increases the time required for the dough to double. Wet doughs (like ciabatta) ferment much faster because the microbes face less physical resistance (Gänzle et al., 1998).

---

### **References**

Di Biase, M., Le Marc, Y., Bavaro, A. R., Lonigro, S. L., Verni, M., Postollec, F., & Valerio, F. (2022). Modeling of growth and organic acid kinetics and evolution of the protein profile and amino acid content during Lactiplantibacillus plantarum ITM21B fermentation in liquid sourdough. _Foods_, _11_(23), 3942. [https://doi.org/10.3390/foods11233942](https://doi.org/10.3390/foods11233942)
Cited by: 14

Gänzle, M. G., Ehmann, M., & Hammes, W. P. (1998). Modeling of growth of _Lactobacillus sanfranciscensis_ and _Candida milleri_ in response to process parameters of sourdough fermentation. _Applied and Environmental Microbiology_, _64_(7), 2616-2623. [https://doi.org/10.1128/aem.64.7.2616-2623.1998](https://doi.org/10.1128/aem.64.7.2616-2623.1998)
Cited by: 309

Vrancken, G., Rimaux, T., Weckx, S., Leroy, F., & De Vuyst, L. (2011). Influence of temperature and backslopping time on the microbiota of a type I propagated laboratory wheat sourdough fermentation. _Applied and Environmental Microbiology_, _77_(8), 2716-2726. [https://doi.org/10.1128/aem.02470-10](https://www.google.com/search?q=https://doi.org/10.1128/aem.02470-10)
Cited by: 129

---

Are you looking to use these equations to build a software tool like a spreadsheet calculator, or are you hoping to use this data to fine-tune your own personal baking intuition?
