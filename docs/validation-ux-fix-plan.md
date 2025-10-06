# Validation UX Fix Plan

**Issue**: Real-time validation on every keystroke creates poor UX  
**Goal**: Validate only on Next/Submit clicks  
**Status**: 📋 **READY**

---

## 🎯 **SOLUTION**
Add `shouldValidate` state to control when contract hooks run. Only validate when user clicks Next/Submit, not while typing.

---

## 📅 **PHASES**

### **Phase 1: Core State** (15 min)
**Files**: `DeedMintForm.tsx`
- Add `shouldValidate` boolean state
- Make `useIsAddressUsed` and `useHasWalletDeed` conditional
- Update validation useEffect to check `shouldValidate`

**Test**: Form loads without validation errors, typing doesn't trigger calls

### **Phase 2: Form Handlers** (10 min)  
**Files**: `DeedMintForm.tsx`
- `handleNext`: Set `shouldValidate = true` before validation
- `handleUpdate`: Set `shouldValidate = false` when user types
- `handlePrevious`: Reset `shouldValidate = false`

**Test**: Next triggers validation, typing clears validation state

### **Phase 3: AddressInput** (10 min)
**Files**: `AddressInput.tsx`
- Clear errors when user types
- Make `canProceed` less strict (basic length only)
- Show errors only after validation attempt

**Test**: Typing clears errors, Next button works correctly

### **Phase 4: Integration** (15 min)
**Test**: Complete form flow, contract validation, error handling

### **Phase 5: Polish** (10 min)
**Test**: Performance, UX, code cleanup

---

## 🔧 **COMMANDS**
```bash
cd /Users/gabrielmiron/development/Base/nft-deed-frontend
cp src/components/DeedMintForm.tsx src/components/DeedMintForm.tsx.backup
npm run dev
```

---

## 📋 **PROGRESS**
- [x] Phase 1: Core State ✅ **COMPLETED**
- [x] Phase 2: Form Handlers ✅ **COMPLETED**
- [x] Phase 3: AddressInput ✅ **COMPLETED**
- [x] Phase 4: Integration ✅ **COMPLETED**
- [ ] Phase 5: Polish

**To execute**: Say "Execute Phase X"
