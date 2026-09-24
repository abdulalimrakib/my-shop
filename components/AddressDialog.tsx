"use client";

import { createAddress, UserAddress } from "@/actions/address";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Spinner } from "./ui/spinner";

const EMPTY_FORM = {
  name: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  default: false,
};

const AddressDialog = ({
  onCreated,
}: {
  onCreated: (address: UserAddress) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const update =
    (field: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const result = await createAddress(form);
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    toast.success("Address saved");
    onCreated(result.address);
    setForm(EMPTY_FORM);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4 text-darkColor">
          Add New Address
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Add a delivery address</DialogTitle>
            <DialogDescription>
              We ship within the United States.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="address-name">Address name</Label>
            <Input
              id="address-name"
              placeholder="Home, Work…"
              value={form.name}
              onChange={update("name")}
              maxLength={50}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address-street">Street address</Label>
            <Input
              id="address-street"
              placeholder="123 Main St, Apt 4"
              value={form.address}
              onChange={update("address")}
              autoComplete="street-address"
              minLength={5}
              maxLength={100}
              required
            />
          </div>
          <div className="grid grid-cols-6 gap-3">
            <div className="grid gap-2 col-span-6 sm:col-span-3">
              <Label htmlFor="address-city">City</Label>
              <Input
                id="address-city"
                value={form.city}
                onChange={update("city")}
                autoComplete="address-level2"
                required
              />
            </div>
            <div className="grid gap-2 col-span-2 sm:col-span-1">
              <Label htmlFor="address-state">State</Label>
              <Input
                id="address-state"
                placeholder="NY"
                value={form.state}
                onChange={update("state")}
                autoComplete="address-level1"
                maxLength={2}
                className="uppercase"
                required
              />
            </div>
            <div className="grid gap-2 col-span-4 sm:col-span-2">
              <Label htmlFor="address-zip">ZIP code</Label>
              <Input
                id="address-zip"
                placeholder="12345"
                value={form.zip}
                onChange={update("zip")}
                autoComplete="postal-code"
                inputMode="numeric"
                maxLength={10}
                required
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="address-default"
              checked={form.default}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, default: checked === true }))
              }
              className="data-[state=checked]:bg-shop_dark_green data-[state=checked]:border-shop_dark_green"
            />
            <Label htmlFor="address-default" className="font-normal">
              Make this my default address
            </Label>
          </div>
          {error && (
            <p role="alert" className="text-sm font-medium text-red-600">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={saving}>
              {saving && <Spinner />}
              Save address
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressDialog;
