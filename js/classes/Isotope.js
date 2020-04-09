class Isotope {
    constructor(protons, neutrons= 0, energy= 0) {
        if (protons === 0 && neutrons === 0) {
            //Energy? Radiation?
        }

        this.protons = protons;
        this.neutrons = neutrons;
        this.atomicMass = -1;
        this.massNumber = -1;
        this.name = 'Unknown';
        this.symbol = '-i';

        if (protons === 1) {
            let element;
            if (neutrons === 1) {
                element = elements.find("Deuterium");
            } else if (neutrons === 2) {
                element = elements.find("Tritium");
            } else {
                element = elements.find("Hydrogen");
            }
            this.name = element.name;
            this.symbol = element.symbol;
            this.atomicMass = element["atomic_mass"];
            this.massNumber = element["#m"];
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
                console.error('could NOT find Element', protons, neutrons);
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
                    console.error('could NOT find Isotope', protons, neutrons);
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

    massDifference() {
        return (this.atomicMass - (this.protons * 1.007276466583 + this.neutrons * 1.00866491595)) * elements.meVPerU;
    }

    
    static fuseIsotopes(isotope_a, isotope_b, energy_a, energy_b) {
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
        if (energy_a + energy_b < barrier) {
            return {
                type: 'reflection',
                resultIsotopes: [isotope_a, isotope_b],
                energy: 0
            }
        }

        let initialEnergy = energy_a + energy_b;
        let initialProtons = isotope_a.protons + isotope_b.protons;
        let initialNeutrons = isotope_a.neutrons + isotope_b.neutrons;
        
        const transmutationEnergy = 1.29;
        while (initialProtons > 1 && initialEnergy >= transmutationEnergy) {
            initialProtons -= 1;
            initialNeutrons += 1;
            initialEnergy -= transmutationEnergy;
        }



        const theorecticalFusion = new Isotope(initialProtons, initialNeutrons);
        
        //fusion

        return {
            type: 'debug',
            resultIsotopes: [theorecticalFusion],
            energy: 0
        }
    }


    static massDeficit(isotope) {
        const num = elem['#m'];
        const neu = Math.floor(elem['atomic_mass']) - num;

        const realEn = (elem['atomic_mass']) / elements.mEv;
        const theoEn = ((num + neu)) / elements.mEv;

        return {
            number: num,
            protons: num,
            neutrons: neu,
            combined: num + neu,
            diff: (theoEn / realEn) * 100
        }
    }
}