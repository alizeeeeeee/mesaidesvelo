import Publicodes, { Evaluation, formatValue } from 'publicodes';
import aides from './build/aides.js';

type Aide = {
	title: string;
	description: string;
	url: string;
	amount: number;
};

type InputParameters = {
	'localisation . code insee': string;
	'localisation . epci': string;
	'localisation . département': string;
	'localisation . région': string;
	'vélo . type':
		| 'mécanique simple'
		| 'électrique'
		| 'cargo'
		| 'cargo électrique'
		| 'pliant'
		| 'motorisation';
	'vélo . prix'?: number;
};

const engine = new Publicodes(aides as any);
const aidesRules = Object.keys(engine.getParsedRules()).filter((dottedName) =>
	dottedName.startsWith('aides .')
);

/**
 *  Retourne la liste des aides disponibles pour une situation donnée
 */
export default function aidesVelo(situation: InputParameters): Array<Aide> {
	engine.setSituation(formatInput(situation));

	return aidesRules
		.map((dottedName) => {
			const { title, rawNode } = engine.getRule(dottedName);
			const value = formatValue(engine.evaluate(dottedName));

			return {
				title,
				description: rawNode.description,
				url: (rawNode as any).lien,
				amount: value === 'Non' ? 0 : parseInt(value)
			};
		})
		.filter(({ amount, url }) => amount && url);
}

const formatInput = (input: InputParameters) =>
	Object.fromEntries(
		Object.entries(input).map(([key, val]) => [
			key,
			typeof val === 'string' ? `'${val.replace(/'/g, '’')}'` : val
		])
	);
