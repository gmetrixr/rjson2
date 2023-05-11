import { recordTypeDefinitions, RT, RTP } from "./RecordTypes";
import { jsUtils } from "@gmetrixr/gdash";

export interface RecordNode<T extends RT> {
  /** 
   * To tell us which factory method can be used to process this json.
   * Allows strings too to directly accept jsons (else jsons give this error: "Type 'string' is not assignable to type 'RecordType.project'")
   */
  type: T | string,
  order?: number, //If no order is given, we assign one. And assume that you want to assign the element to the end.
  name?: string,
  /** properties. Ideally don't store id,name,type again inside (note: this type is not element_type) */
  props: Partial<Record<RTP[T], unknown>>
  /** children. A map of named collections */
  records?: Partial<Record<RT, RecordMap<RT>>>
}

export type RecordMap<T extends RT> = Record<string, RecordNode<T>>

/**
 * Creates an object of any of the known record types
 * name is optional - used only in case this rcord type needs a name. In case not given, can also use once from rt definitions.
 * order to not assigned to this record - as it doesn't make sense right. It will automatically get once, once this record enters the main tree
 */
export const createRecord = <T extends RT>(type: T, name?: string) :RecordNode<T> => {
  const node: RecordNode<T> = {
    type: type,
    //name: name ?? recordTypeDefinitions[type].defaultName, Optional. So we check below if it is even needed.
    props: {},
    //records: {}, //Optional, so don't set here. Automatically set when first record is added.
  }
  //Add name only if this RecordType uses name
  if(recordTypeDefinitions[type].defaultName !== undefined) {
    node.name = name ?? recordTypeDefinitions[type].defaultName;
  }
  return node;
};

/** clipboard contains the strigified version of this */
export interface ClipboardR {
  /** parentType controls where this object can be pasted */
  // parentType: RT, Might need to get this back
  nodes: RecordNode<RT>[]
}

// export type Clipboard = {
//   metadata: Record<string, string>,
//   content: ClipboardR[]
// };
