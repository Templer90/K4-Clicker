class Isotope {
    constructor(protons, neutrons = 0, energy = 0) {
        if (protons === 0 && neutrons === 0) {
            //Energy? Radiation? debug?
        }

        this.protons = protons;
        this.neutrons = neutrons;
        this.atomicMass = -1;
        this.massNumber = -1;
        this.name = 'Unknown';
        this.symbol = '-i';

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
        } else {
            const element = elements.list.find((e) => {
                return e["#m"] === protons;
            });

            if (element === undefined) {
                //console.log('could NOT find Element', protons, neutrons);
                return;
            }

            if (neutrons === undefined) {
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

    hasValidNucleide() {
        return Isotope.hasValidNucleide(this.protons, this.neutrons);
    }

    //Decays in less then one billionth of an second
    isStableForFusion() {
        const list = [
            {p: 5, n: 1, t: 0},
            
            {p: 1, n: 6, t: 23e-24},
            {p: 1, n: 4, t: 80e-24},
            {p: 1, n: 3, t: 139e-24},
            {p: 7, n: 3, t: 200e-24},
            {p: 1, n: 5, t: 290e-24},
            {p: 3, n: 2, t: 304e-24},
            {p: 5, n: 2, t: 350e-24},
            {p: 8, n: 4, t: 580e-24},
            {p: 7, n: 4, t: 590e-24},
            {p: 3, n: 1, t: 756e-24},
            {p: 2, n: 3, t: 760e-24},

            {p: 11, n: 7, t: 1e-21},
            {p: 2, n: 8, t: 1e-21},
            {p: 3, n: 7, t: 2e-21},
            {p: 6, n: 2, t: 2e-21},
            {p: 2, n: 5, t: 3e-21},
            {p: 4, n: 2, t: 5e-21},
            {p: 2, n: 7, t: 7e-21},
            {p: 5, n: 4, t: 80e-21},

            {p: 4, n: 4, t: 10e-18},

            {p: 5, n: 11, t: 190e-12},
            {p: 4, n: 9, t: 500e-12},

            {p: 2, n: 8, t: 1e-21},

            {p: 3, n: 9, t: 10e-9},
            {p: 5, n: 13, t: 26e-9},
            {p: 6, n: 15, t: 30e-9},
            {p: 4, n: 11, t: 200e-9},
            {p: 4, n: 12, t: 200e-9},
            {p: 84, n: 128, t: 299e-9},
        ];


        return list.find((entry) => entry.p === this.protons && entry.n === this.neutrons) === undefined;
    }

    massDifferenceEnergy() {
        return this.massDeficit() * elements.meVPerU;
    }

    massDeficit() {
        return (this.protons * 1.007276466583 + this.neutrons * 1.00866491595) - this.atomicMass;
    }

    nuclearEnergy() {
        return (this.protons * 1.007276466583 + this.neutrons * 1.00866491595) * elements.meVPerU - this.massDifferenceEnergy();
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

    static BetaRadiation() {
        return new Isotope(2, 2);
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

    static hasValidNucleide(protons, neutrons) {
        if (protons === 1 && neutrons === 0) return true;//Hydrogen
        if (protons === 1 && neutrons === 1) return true;//Deuterium
        if (protons === 1 && neutrons === 2) return true;//Tritium
        if (protons === 0 && neutrons === 1) return true;//Neutron
        if (protons <= 0) return false;
        if (neutrons <= 0) return false;
        return true;
    }

    static fuseIsotopes(isotope_a, isotope_b, energy_a = 0, energy_b = 0) {
        // http://hyperphysics.phy-astr.gsu.edu/hbase/NucEne/coubar.html
        let coulomb_barrier = (iso1, iso2 = undefined) => {
            const mul = 1.43997218e-15; //1.43997218e-9;  e²/(4*pi*permeability of vacuum); because I want MeV i divide by a million 
            const r1 = 1.2e-15 * Math.pow(iso1.massNumber, 0.33333333333333);
            let r2 = 0;
            let mass2 = 1;
            if (iso2 !== undefined) {
                r2 = 1.2e-15 * Math.pow(iso2.massNumber, 0.33333333333333);
                mass2 = iso2.protons;
            }

            return mul * (iso1.protons * mass2) / (r1 + r2); // in MeV
        };

        const barrier = coulomb_barrier(isotope_a, isotope_b);
        if ((energy_a + energy_b) < barrier) {
            return {
                type: 'reflection',
                resultIsotopes: [isotope_a, isotope_b],
                energy: 0
            }
        }

        let initialEnergy = energy_a + energy_b;
        let initialProtons = isotope_a.protons + isotope_b.protons;
        let initialNeutrons = isotope_a.neutrons + isotope_b.neutrons;

        let decayProducts = [];
        let debugdecayList = [];

        //fusion
        let intermediateFusionProduct = new Isotope(initialProtons, initialNeutrons);
        let fusionEnergy = intermediateFusionProduct.massDifferenceEnergy() + initialEnergy;

        //Decay
        const potentialDecays = [new Neutron(), Isotope.Hydrogen(), Isotope.AlphaRadiation()];
        let chosenDecay;
        let decays;
        let energyLostByConversions = 0;
        for (let i = 0; (i < 10) && Isotope.isBalanced([isotope_a, isotope_b], decayProducts) === false; i++) {
            decays = potentialDecays.map((eject) => {
                const protonDiff = intermediateFusionProduct.protons - eject.protons;
                const neutronDiff = intermediateFusionProduct.neutrons - eject.neutrons;

                if (Isotope.hasValidNucleide(protonDiff, neutronDiff) === false) {
                    return undefined
                }

                let product = new Isotope(protonDiff, neutronDiff);
                let E = (intermediateFusionProduct.atomicMass - product.atomicMass - eject.atomicMass) * elements.meVPerU; //energy is negative IE you gain energy by doing this

                return {
                    energy: -E,
                    eject: eject,
                    product: product,
                    name: eject.name
                };
            });

            //beta-plus-decay
            let newProtons = intermediateFusionProduct.protons - 1;
            let newNeutrons = intermediateFusionProduct.neutrons + 1;
            if (newProtons > 0 && newNeutrons >= 0) {
                let transmutation = new Isotope(newProtons, newNeutrons);
                if (intermediateFusionProduct.atomicMass - transmutation.atomicMass) {
                    const positron = new Positron();
                    decays.push({
                        energy: -((intermediateFusionProduct.atomicMass - transmutation.atomicMass) * elements.meVPerU),
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
                if (intermediateFusionProduct.atomicMass + (2 * electron.atomicMass) > transmutation.atomicMass) {
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
            });

            //add the "no Decay" aka the isotope stays as is
            if (intermediateFusionProduct.hasValidNucleide()
                && intermediateFusionProduct.isStableForFusion()) {
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

            debugdecayList.push(decays, intermediateFusionProduct);

            chosenDecay = decays[0];
            energyLostByConversions -= chosenDecay.energy;

            if (chosenDecay.eject === undefined) {
                decayProducts.push(chosenDecay.product);
                break;
            } else {
                if (chosenDecay.eject.atomicMass > chosenDecay.product.atomicMass) {
                    decayProducts.push(chosenDecay.product);
                    intermediateFusionProduct = chosenDecay.eject;
                    fusionEnergy = fusionEnergy * ((chosenDecay.eject.atomicMass + chosenDecay.product.atomicMass) / chosenDecay.product.atomicMass);
                } else {
                    decayProducts.push(chosenDecay.eject);
                    intermediateFusionProduct = chosenDecay.product;
                    fusionEnergy = fusionEnergy * ((chosenDecay.eject.atomicMass + chosenDecay.product.atomicMass) / chosenDecay.eject.atomicMass);
                }
            }
        }

        if (
            (Isotope.isBalanced([isotope_a, isotope_b], decayProducts) === false)
            || (decayProducts.find((iso) => iso.name === 'Unknown') !== undefined)
        ) {
            return {
                type: 'error',
                input: [isotope_a, isotope_b],
                chosenDecay: chosenDecay,
                decays: decays,
                decayProducts: decayProducts,
                test: Isotope.isBalanced([isotope_a, isotope_b], decayProducts),
                resultIsotopes: [],
                debugdecayList: debugdecayList,
            };
        }

        return {
            debugdecayList: debugdecayList,
            resultIsotopes: decayProducts,
            energy: fusionEnergy - chosenDecay.energy - ((fusionEnergy + chosenDecay.energy) - (energy_a + energy_b)),
            deltaEnergy: fusionEnergy - (energy_a + energy_b) - energyLostByConversions,
            energyLostByConversions: energyLostByConversions,
            test: Isotope.isBalanced([isotope_a, isotope_b], decayProducts),
            yield: ((isotope_a.nuclearEnergy() + isotope_b.nuclearEnergy()) - decayProducts.reduce((acc, cur) => acc + cur.nuclearEnergy(), 0)) * elements.meVPerU
        };
    }
}

class Neutron extends Isotope {
    constructor() {
        super(0, 1);
    }

    hasValidNucleide() {
        return true;
    }
}

class Electron extends Isotope {
    constructor() {
        super(0, 0, 0);

        this.name = 'Electron';
        this.symbol = 'e';
        this.protons = -1;
        this.neutrons = 1;
        this.atomicMass = 0.51099895;
        this.massNumber = 0;
    }

    hasValidNucleide() {
        return true;
    }
}

class Positron extends Isotope {
    constructor() {
        super(0, 0, 0);

        this.name = 'Positron';
        this.symbol = 'e+';
        this.protons = 1;
        this.neutrons = -1;
        this.atomicMass = 0.5109989461;
        this.massNumber = 0;
    }

    hasValidNucleide() {
        return true;
    }
}