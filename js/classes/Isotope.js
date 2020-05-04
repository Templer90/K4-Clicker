class Isotope {

    //Decays in less then one billionth of an second
    static ShortDecayingIsotopes = [
        {protons: 5, neutrons: 1, halfLife: 0},
        {protons: 2, neutrons: 0, halfLife: 0},

        {protons: 1, neutrons: 6, halfLife: 23e-24},
        {protons: 1, neutrons: 4, halfLife: 80e-24},
        {protons: 1, neutrons: 3, halfLife: 139e-24},
        {protons: 7, neutrons: 3, halfLife: 200e-24},
        {protons: 1, neutrons: 5, halfLife: 290e-24},
        {protons: 3, neutrons: 2, halfLife: 304e-24},
        {protons: 5, neutrons: 2, halfLife: 350e-24},
        {protons: 8, neutrons: 4, halfLife: 580e-24},
        {protons: 7, neutrons: 4, halfLife: 590e-24},
        {protons: 3, neutrons: 1, halfLife: 756e-24},
        {protons: 2, neutrons: 3, halfLife: 760e-24},

        {protons: 11, neutrons: 7, halfLife: 1e-21},
        {protons: 2, neutrons: 8, halfLife: 1e-21},
        {protons: 3, neutrons: 7, halfLife: 2e-21},
        {protons: 6, neutrons: 2, halfLife: 2e-21},
        {protons: 2, neutrons: 5, halfLife: 3e-21},
        {protons: 4, neutrons: 2, halfLife: 5e-21},
        {protons: 2, neutrons: 7, halfLife: 7e-21},
        {protons: 5, neutrons: 4, halfLife: 80e-21},

        {protons: 4, neutrons: 4, halfLife: 10e-18},

        {protons: 5, neutrons: 11, halfLife: 190e-12},
        {protons: 4, neutrons: 9, halfLife: 500e-12},

        {protons: 2, neutrons: 8, halfLife: 1e-21},

        {protons: 3, neutrons: 9, halfLife: 10e-9},
        {protons: 5, neutrons: 13, halfLife: 26e-9},
        {protons: 6, neutrons: 15, halfLife: 30e-9},
        {protons: 4, neutrons: 11, halfLife: 200e-9},
        {protons: 4, neutrons: 12, halfLife: 200e-9},
        {protons: 84, neutrons: 128, halfLife: 299e-9},
    ];

    constructor(a, b) {
        this.protons = -1;
        this.neutrons = -1;
        this.atomicMass = -1;
        this.massNumber = -1;
        this.name = 'Unknown';
        this.symbol = '-i';

        if (elements.isElementArray(a)) {
            this.ElementObjectConstructor(a, b);
        } else {
            this.ProtonNeutronConstructor(a, b);
        }
    }

    InvalidConstructor() {
        this.name = 'Invalid';
        this.symbol = '-i';
        this.protons = 0;
        this.neutrons = 0;
        this.atomicMass = 0;
        this.massNumber = 0;
    }

    ElementObjectConstructor(obj, isotopeNumber = undefined) {
        this.atomicMass = obj['atomic_mass'];
        this.massNumber = obj['#m'];
        this.name = obj['name'];
        this.symbol = obj['symbol'];

        if (isotopeNumber === undefined) {
            this.protons = this.massNumber;
            this.neutrons = Math.floor(this.atomicMass) - this.massNumber;
        } else {
            const iso = obj.isotopes.find((e) => e['#m'] == isotopeNumber)
            if (iso === undefined) {
                this.InvalidConstructor();
                console.error('invalid Isotope');
            } else {
                this.atomicMass = iso["relAM"];
                this.massNumber = iso["#m"];

                this.protons = obj['#m'];
                this.neutrons = this.massNumber - this.protons;
            }
        }
    }


    ProtonNeutronConstructor(protons, neutrons = 0, energy = 0) {
        if (protons === 0 && neutrons === 0) {
            //Energy? Radiation? debug?
        }

        this.protons = protons;
        this.neutrons = neutrons;

        if (protons === 1) {
            let element;
            if (neutrons === 0) {
                element = elements.find("Hydrogen");
            } else if (neutrons === 1) {
                element = elements.find("Deuterium");
            } else if (neutrons === 2) {
                element = elements.find("Tritium");
            } else {
                return;
            }
            this.name = element.name;
            this.symbol = element.symbol;
            this.atomicMass = element["atomic_mass"];
            this.massNumber = element.isotopes[0]["#m"];
        } else if (protons === 0 && neutrons === 1) {
            let element = elements.find("Neutron");

            this.name = element.name;
            this.symbol = element.symbol;
            this.atomicMass = element["atomic_mass"];
            this.massNumber = element["#m"];
        } else if (protons === 2 && neutrons === 0) {
            this.name = 'DiHydrogen';
            this.symbol = 'di';
            this.atomicMass = 2;
            this.massNumber = 2;
        } else {
            const element = elements.list.find((e) => {
                return e["#m"] === protons;
            });

            if (element === undefined) {
                //console.log('could NOT find Element', protons, neutrons);
                return;
            }

            if (neutrons === 0) {
                this.atomicMass = element["atomic_mass"];
                this.massNumber = element["#m"];
                this.neutrons = Math.floor(this.atomicMass) - this.massNumber;
            } else {
                const iso = element.isotopes.find((is) => {
                    return is["#m"] === (neutrons + protons);
                });
                if (iso === undefined) {
                    //console.log('could NOT find Isotope', protons, neutrons);
                    return;
                }

                this.atomicMass = iso["relAM"];
                this.massNumber = iso["#m"];
                this.neutrons = neutrons;
            }

            this.name = element.name;
            this.symbol = element.symbol;
        }
    }

    hasValidNuclide() {
        return Isotope.hasValidNuclide(this.protons, this.neutrons);
    }

    //Decays in less then one billionth of an second
    isStableForFusion() {
        return Isotope.ShortDecayingIsotopes.find((entry) => entry.protons === this.protons && entry.neutrons === this.neutrons) === undefined;
    }

    massDifferenceEnergy() {
        return this.massDeficit() * elements.meVPerU;
    }

    massDeficit() {
        return this.theoreticalMass() - this.atomicMass;
    }

    theoreticalMass() {
        return this.protons * elements.ProtonMass + this.neutrons * elements.NeutronMass;
    }

    nuclearEnergy() {
        return this.theoreticalMass() * elements.meVPerU - this.massDifferenceEnergy();
    }

    nuclearBindingEnergy() {
        return this.massDifferenceEnergy();
    }

    static Hydrogen() {
        return new Isotope(1, 0);
    }

    static Deuterium() {
        return new Isotope(1, 1);
    }

    static Tritium() {
        return new Isotope(1, 2);
    }

    static Helium() {
        return new Isotope(2, 2);
    }

    static AlphaRadiation() {
        return new Isotope(2, 2);
    }

    static isBalanced(input, output) {
        const inputP = input.reduce((acc, cur) => acc + cur.protons, 0);
        const inputMass = input.reduce((acc, cur) => acc + cur.massNumber, 0);
        const outputP = output.reduce((acc, cur) => acc + cur.protons, 0);
        const outMass = output.reduce((acc, cur) => acc + cur.massNumber, 0);

        return (inputP === outputP) && ((inputMass === outMass));
    }

    static hasValidNuclide(protons, neutrons) {
        if (protons === 1 && neutrons === 0) return true;//Hydrogen
        if (protons === 1 && neutrons === 1) return true;//Deuterium
        if (protons === 1 && neutrons === 2) return true;//Tritium
        if (protons === 0 && neutrons === 1) return true;//Neutron
        if (protons <= 0) return false;
        if (neutrons <= 0) return false;
        return true;
    }


    /**
     *
     * @param isotope_a Isotope
     * @param isotope_b Isotope
     * @param energy_a Number
     * @param energy_b Number
     * @returns {{Q: number, Q2: number, resultIsotopes: [], debugdecayList: [], energy: number}|{resultIsotopes: [*, *], type: string, energy: number}|{input: [*, *], resultIsotopes: [], debugdecayList: [], test: *, decayProducts: [], chosenDecay: *, decays: *, type: string}}
     */
    static fuseIsotopes(isotope_a, isotope_b, energy_a = 0, energy_b = 0) {
        // http://hyperphysics.phy-astr.gsu.edu/hbase/NucEne/coubar.html
        const coulomb_barrier = (iso1, iso2 = undefined) => {
            const mul = 1.43997218e-15; //1.43997218e-9;  e²/(4*pi*permeability of vacuum); because I want MeV, I divide by a million 
            const r1 = 1.2e-15 * Math.pow(iso1.massNumber, 0.33333333333333);
            let r2 = 0;
            let mass2 = 1;
            if (iso2 !== undefined) {
                r2 = 1.2e-15 * Math.pow(iso2.massNumber, 0.33333333333333);
                mass2 = iso2.protons;
            }

            return mul * (iso1.protons * mass2) / (r1 + r2); // in MeV
        };

        const barrierEnergy = coulomb_barrier(isotope_a, isotope_b);
        if ((energy_a + energy_b) < barrierEnergy) {
            return {
                type: 'reflection',
                resultIsotopes: [isotope_a, isotope_b],
                energy: 0
            }
        }

        const initialEnergy = energy_a + energy_b;
        const initialProtons = isotope_a.protons + isotope_b.protons;
        const initialNeutrons = isotope_a.neutrons + isotope_b.neutrons;

        let decayProducts = [];
        let debuggedList = [];

        //fusion
        let intermediateFusionProduct = new Isotope(initialProtons, initialNeutrons);
        let fusionEnergy = intermediateFusionProduct.massDifferenceEnergy() + initialEnergy;

        //Decay
        const potentialDecays = [new Neutron(), Isotope.Hydrogen(), Isotope.AlphaRadiation()];
        let chosenDecay;
        let decays;
        let energyLostByConversions = 0;
        for (let i = 0; (i < 10) && Isotope.isBalanced([isotope_a, isotope_b], decayProducts) === false; i++) {

            //Add the potential decays of Beta radiation, Alpha radiation, and ejecting a proton
            decays = potentialDecays.map((eject) => {
                const protonDiff = intermediateFusionProduct.protons - eject.protons;
                const neutronDiff = intermediateFusionProduct.neutrons - eject.neutrons;

                if (Isotope.hasValidNuclide(protonDiff, neutronDiff) === false) {
                    return undefined
                }

                let product = new Isotope(protonDiff, neutronDiff);
                let E = (intermediateFusionProduct.atomicMass - product.atomicMass - eject.atomicMass) * elements.meVPerU; //energy is negative IE you gain energy by doing this

                return {
                    energy: -E,
                    eject: eject,
                    product: product
                };
            });

            //beta-plus-decay
            let newProtons = intermediateFusionProduct.protons - 1;
            let newNeutrons = intermediateFusionProduct.neutrons + 1;
            if (newProtons > 0 && newNeutrons >= 0) {
                let transmutation = new Isotope(newProtons, newNeutrons);
                const positron = new Positron();
                let internalEnergy = -((intermediateFusionProduct.atomicMass - transmutation.atomicMass - positron.atomicMass) * elements.meVPerU);
                if (
                    (
                        (intermediateFusionProduct.atomicMass - transmutation.atomicMass >= (2 * positron.atomicMass)) ||
                        (intermediateFusionProduct.protons === 2 && intermediateFusionProduct.neutrons === 0)
                    )
                    && (internalEnergy >= 0)
                ) {
                    decays.push({
                        energy: internalEnergy,
                        eject: positron,
                        product: transmutation
                    });
                }
            }

            //beta-minus-decay
            newProtons = intermediateFusionProduct.protons + 1;
            newNeutrons = intermediateFusionProduct.neutrons - 1;
            if (newProtons > 0 && newNeutrons >= 0) {
                let transmutation = new Isotope(newProtons, newNeutrons);
                const electron = new Electron();
                let internalEnergy = -((intermediateFusionProduct.atomicMass - transmutation.atomicMass - electron.atomicMass) * elements.meVPerU);
                if (
                    (intermediateFusionProduct.atomicMass >= transmutation.atomicMass) &&
                    (internalEnergy <= 0)
                ) {
                    decays.push({
                        energy: -((intermediateFusionProduct.atomicMass - transmutation.atomicMass - electron.atomicMass) * elements.meVPerU),
                        eject: electron,
                        product: transmutation
                    });
                }
            }


            //remove invalid entries
            decays = decays.filter((a) => {
                return a !== undefined
            }).filter((a) => {
                return a.eject.name !== 'Unknown'
            }).filter((a) => {
                return a.product.name !== 'Unknown'
            });//.filter((a) => a.energy >=0);

            //add the "no Decay" aka the isotope stays as is
            if (intermediateFusionProduct.hasValidNuclide() &&
                intermediateFusionProduct.isStableForFusion()) {
                decays.push({
                    energy: fusionEnergy,
                    eject: undefined,
                    product: intermediateFusionProduct
                });
            }

            //Sorting
            decays = decays.sort((a, b) => {
                //return (a.energy - b.energy);
                const bindingA = a.product.nuclearBindingEnergy() + ((a.eject !== undefined) ? a.eject.nuclearBindingEnergy() : 0);
                const bindingB = b.product.nuclearBindingEnergy() + ((b.eject !== undefined) ? b.eject.nuclearBindingEnergy() : 0);
                return (bindingB - bindingA) - (intermediateFusionProduct.nuclearBindingEnergy() + fusionEnergy);
            });

            debuggedList.push(decays, intermediateFusionProduct);

            //If we can not chose a decay-path, we stay
            if (decays.length === 0) {
                chosenDecay = {
                    energy: 0,
                    eject: undefined,
                    product: intermediateFusionProduct
                };
            } else {
                chosenDecay = decays[0];
                energyLostByConversions += chosenDecay.energy;
            }


            //If we chose to not decay then we are done
            if (chosenDecay.eject === undefined) {
                decayProducts.push(chosenDecay.product);
                break;
            } else {
                const {atomicMass: ejectAtomicMass} = chosenDecay.eject;
                if (ejectAtomicMass > chosenDecay.product.atomicMass) {
                    decayProducts.push(chosenDecay.product);
                    intermediateFusionProduct = chosenDecay.eject;
                    fusionEnergy = fusionEnergy * ((ejectAtomicMass + chosenDecay.product.atomicMass) / chosenDecay.product.atomicMass);
                } else {
                    decayProducts.push(chosenDecay.eject);
                    intermediateFusionProduct = chosenDecay.product;
                    fusionEnergy = fusionEnergy * ((ejectAtomicMass + chosenDecay.product.atomicMass) / ejectAtomicMass);
                }
            }
        }

        //If the result is not valid then throw an error
        if (
            (Isotope.isBalanced([isotope_a, isotope_b], decayProducts) === false) ||
            (decayProducts.find((iso) => iso.name === 'Unknown') !== undefined)
        ) {
            return {
                type: 'error',
                input: [isotope_a, isotope_b],
                chosenDecay: chosenDecay,
                decays: decays,
                decayProducts: decayProducts,
                test: Isotope.isBalanced([isotope_a, isotope_b], decayProducts),
                resultIsotopes: [new Invalid()],
                debuggedList: debuggedList,
            };
        }

        //0.511MeV per participants = 1.022MeV
        //Mass of produced neutrino: (elements.NeutronMass-(elements.ProtonMass+(new Positron()).atomicMass))*elements.meVPerU = 0.2713777741148183
        const numberPositrons = decayProducts.reduce((acc, cur) => acc + ((cur instanceof Positron) ? 1 : 0), 0);
        const annihilationEnergy = numberPositrons * (1.022);

        debuggedList.push({before: 1, decayProducts: decayProducts});
        //decayProducts = decayProducts.filter((cur) => {return !(cur instanceof Positron);});

        //const numberElectrons = decayProducts.reduce((acc, cur) => acc + (cur.name === 'Electron' ? 1 : 0), 0);
        //const ElectronEnergy = numberPositrons * (1.022);
        //decayProducts = decayProducts.filter((a) => {
        //    return a.name !== 'Positron'
        //});

        //Sorting
        decayProducts = decayProducts.sort((a, b) => {
            return (b.atomicMass - a.atomicMass)
        });

        const Q_Value = annihilationEnergy + (((isotope_a.atomicMass + isotope_b.atomicMass) - decayProducts.reduce((acc, cur) => acc + cur.atomicMass, 0)) * elements.meVPerU);
        const Q_Value2 = annihilationEnergy + decayProducts.reduce((acc, cur) => acc + cur.nuclearBindingEnergy(), 0) - isotope_a.nuclearBindingEnergy() - isotope_b.nuclearBindingEnergy();

        return {
            type: 'fusion',
            debuggedList: debuggedList,
            resultIsotopes: decayProducts,
            energy: (fusionEnergy + Q_Value) - chosenDecay.energy - ((fusionEnergy + chosenDecay.energy) - (energy_a + energy_b)),
            Q: Q_Value,
            Q2: Q_Value2
        };
    }
}

class Invalid extends Isotope {
    constructor() {
        super(0, 0);
        this.InvalidConstructor()
    }

    hasValidNuclide() {
        return false;
    }
}

class Neutron extends Isotope {
    constructor() {
        super(0, 1);
    }

    hasValidNuclide() {
        return true;
    }
}

class Electron extends Isotope {
    constructor() {
        super(0, 0, 0);

        this.name = 'Electron';
        this.symbol = 'e';
        this.protons = 0;
        this.neutrons = -1;
        this.atomicMass = 5.48579909065e-4;//0.51099895;
        this.massNumber = 0;
    }

    hasValidNuclide() {
        return true;
    }
}

class Positron extends Isotope {
    constructor() {
        super(0, 0, 0);

        this.name = 'Positron';
        this.symbol = 'e+';
        this.protons = 1;
        this.neutrons = 0;
        this.atomicMass = 5.48579909065e-4;//0.51099895;
        this.massNumber = 0;
    }

    hasValidNuclide() {
        return true;
    }
}