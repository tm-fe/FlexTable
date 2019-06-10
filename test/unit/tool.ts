/**
 * set foot
 * @param aDoms
 * @param aFootValue
 * @param aFootLabel
 */
// tslint:disable-next-line:max-line-length
export function setFoot(aDoms: NodeListOf<HTMLParagraphElement> | HTMLCollection, aFootValue: string[], aFootLabel: string[]) {
    if (aDoms[0] && aDoms[0].textContent) {
        aFootValue.push(aDoms[0].textContent);
    }
    if (aDoms[1] && aDoms[1].textContent) {
        aFootLabel.push(aDoms[1].textContent);
    }
}
