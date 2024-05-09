interface Step {
  address: number;
  action: string | null;
}

export interface SuccessOutput {
  status: string;
  steps: Step[];
}

export interface ErrorOutput {
  status: string;
  error_code: string;
  error_message: string;
}

export class DeliveryChecker {
  private path: number[];
  private pickups: Set<number>;
  private dropoffs: Map<number, number>;

  constructor(path: number[], deliveries: [number, number][]) {
    this.path = path;
    this.pickups = new Set<number>();
    this.dropoffs = new Map<number, number>();

    for (const [pickup, dropoff] of deliveries) {
      this.pickups.add(pickup);
      this.dropoffs.set(dropoff, pickup); // Mapping each dropoff to its pickup to ensure it hasn't been visited
    }
  }

  public validatePath(): SuccessOutput | ErrorOutput {
    const actions: string[] = [];

    for (const address of this.path) {
      if (this.pickups.has(address)) {
        actions.push("pickup");
        this.pickups.delete(address);
      } else if (this.dropoffs.has(address)) {
        const pickup = this.dropoffs.get(address);
        if (this.pickups.has(pickup)) {
          return {
            status: "error",
            error_code: "delivery_dropoff_before_pickup",
            error_message: `Tried dropping off at address ${address} before picking up at ${pickup}`,
          };
        } else {
          actions.push("dropoff");
          this.dropoffs.delete(address);
        }
      } else {
        actions.push(null);
      }
    }
    console.log(this.dropoffs.size);

    if (this.pickups.size !== 0 || this.dropoffs.size !== 0) {
      const missingAddressesArray = [...this.pickups, ...this.dropoffs.keys()];
      return {
        status: "error",
        error_code: "delivery_address_not_in_path",
        error_message: `Delivery addresses not in path: [${missingAddressesArray.join(
          ", "
        )}]`,
      };
    }

    return {
      status: "success",
      steps: this.path.map((address, index) => ({
        address,
        action: actions[index],
      })),
    };
  }
}

if (require.main === module) {
  const deliveries = JSON.parse(process.argv[2]);
  const path = JSON.parse(process.argv[3]);
  const deliveryChecker = new DeliveryChecker(path, deliveries);
  console.log(deliveryChecker.validatePath());
}
