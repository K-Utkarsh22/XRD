function predictLattice() {
    const input = document.getElementById('thetaValues').value;
    const lambda = parseFloat(document.getElementById('lambdaValue').value);
    const resultContainer = document.getElementById('resultContainer');
    const predictionResult = document.getElementById('predictionResult');
    const ratioOutput = document.getElementById('ratioOutput');
    const paramOutput = document.getElementById('paramOutput');

    const twoThetaArray = input.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val));

    if (twoThetaArray.length < 3 || isNaN(lambda)) {
        alert("Please enter at least 3 valid 2-theta values and a valid wavelength.");
        return;
    }

    const thetaArray = twoThetaArray.map(twoTheta => twoTheta / 2);
    const sinSqArray = thetaArray.map(theta => Math.pow(Math.sin(theta * (Math.PI / 180)), 2));
    const minSinSq = sinSqArray[0];
    const ratios = sinSqArray.map(val => val / minSinSq);

    let lattice = "Unknown / Complex";
    const secondRatio = ratios[1];
    let h2k2l2 = 0;

    if (Math.abs(secondRatio - 1.33) < 0.15) {
        lattice = "FCC";
        h2k2l2 = 3;
    } else if (Math.abs(secondRatio - 2.0) < 0.15) {
        lattice = "BCC / SC";
        h2k2l2 = 2; 
    }

    resultContainer.style.display = "block";
    predictionResult.innerText = `Structure: ${lattice}`;
    
    const formattedRatios = ratios.map(r => r.toFixed(2)).join(' : ');
    ratioOutput.innerText = `Ratios: ${formattedRatios}`;

    if (h2k2l2 > 0) {
        const theta1Rad = thetaArray[0] * (Math.PI / 180);
        const a = (lambda * Math.sqrt(h2k2l2)) / (2 * Math.sin(theta1Rad));
        let baseText = `Calculated Lattice Parameter (a): ${a.toFixed(4)} Å`;
        if (lattice === "BCC / SC") {
            baseText += " *(Assuming BCC)";
        }
        paramOutput.innerText = baseText;
    } else {
        paramOutput.innerText = "Lattice Parameter (a): Cannot be calculated.";
    }
}