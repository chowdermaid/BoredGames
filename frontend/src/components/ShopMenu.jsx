import React from 'react';
import {
  Button,
  TextField,
  FormGroup,
  RadioGroup,
  FormControl,
  FormLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Slider,
} from '@material-ui/core';

import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useShop } from '../context/ShopContext';

import '../components/assets/scss/ShopPage.scss';

const ShopMenu = () => {
  const {
    search,
    setSearch,
    priceSlider,
    setPriceSlider,
    yearSlider,
    setYearSlider,
    playerSlider,
    setPlayerSlider,
    ageSlider,
    setAgeSlider,
    playtimeSlider,
    setPlaytimeSlider,
    curve,
    setCurve,
    depth,
    setDepth,
    submitSearch,
    difficultyNames,
    calculateValue,
    priceLabelFormat,
    playTimeLabelFormat,
    calculateYear,
    displayCategories,
    displayMechanics,
  } = useShop();

  return (
    <div className="shopMenu">
      <form className="alignForm" onSubmit={submitSearch}>
        <h2>SEARCH IN COLLECTION</h2>
        <Button
          style={{ backgroundColor: '#4CB4A4' }}
          variant="contained"
          id="browseButton"
          type="submit"
        >
          <b>Apply Filters</b>
        </Button>
        <TextField
          value={search}
          className="maxWidth"
          label="Search..."
          onChange={(e) => setSearch(e.target.value)}
        ></TextField>
        {/* Price Range */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" component="h6">
              Price
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <FormLabel>
              {priceLabelFormat(priceSlider[0] * 5)} -{' '}
              {priceLabelFormat(priceSlider[1] * 5)}
            </FormLabel>
            <Slider
              style={{ color: 'rgb(76, 180, 164)' }}
              min={0}
              max={70}
              value={priceSlider}
              scale={calculateValue}
              getAriaValueText={priceLabelFormat}
              valueLabelFormat={priceLabelFormat}
              valueLabelDisplay="auto"
              onChange={(e) => setPriceSlider(e.target.value)}
            />
          </AccordionDetails>
        </Accordion>
        {/* Year Search */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" component="h6">
              Year Published
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <FormLabel>
              {yearSlider[0] + 1971} to {yearSlider[1] + 1971}{' '}
            </FormLabel>
            <Slider
              style={{ color: 'rgb(76, 180, 164)' }}
              min={1}
              max={50}
              scale={calculateYear}
              value={yearSlider}
              valueLabelDisplay="auto"
              onChange={(e) => setYearSlider(e.target.value)}
            />
          </AccordionDetails>
        </Accordion>
        {/* Category */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" component="h6">
              Categories
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              <div className="categoriesList">{displayCategories}</div>
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        {/* Mechanics */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" component="h6">
              Mechanics
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              <div className="categoriesList">{displayMechanics}</div>
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        {/* Players */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" component="h6">
              Players
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormLabel>
              {playerSlider[0]} to {playerSlider[1]} players
            </FormLabel>
            <Slider
              style={{ color: 'rgb(76, 180, 164)' }}
              min={1}
              max={20}
              value={playerSlider}
              valueLabelDisplay="auto"
              onChange={(e) => setPlayerSlider(e.target.value)}
            />
            <FormLabel>Rating {ageSlider}+</FormLabel>
            <Slider
              style={{ color: 'rgb(76, 180, 164)' }}
              min={1}
              max={18}
              value={ageSlider}
              valueLabelDisplay="auto"
              onChange={(e) => setAgeSlider(e.target.value)}
            />
          </AccordionDetails>
        </Accordion>
        {/* Play time */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" component="h6">
              Play time
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormLabel>
              {playTimeLabelFormat(playtimeSlider[0] * 5)} -{' '}
              {playTimeLabelFormat(playtimeSlider[1] * 5)}
            </FormLabel>
            <Slider
              style={{ color: 'rgb(76, 180, 164)' }}
              min={0}
              max={100}
              value={playtimeSlider}
              scale={calculateValue}
              getAriaValueText={playTimeLabelFormat}
              valueLabelFormat={playTimeLabelFormat}
              valueLabelDisplay="auto"
              onChange={(e) => setPlaytimeSlider(e.target.value)}
            />
          </AccordionDetails>
        </Accordion>
        {/* Difficulty */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" component="h6">
              Difficulty
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl>
              <FormLabel>Learning Curve</FormLabel>
              <RadioGroup>
                <Box sx={{ width: '15rem' }}>
                  <Slider
                    style={{ color: 'rgb(76, 180, 164)' }}
                    min={1}
                    max={5}
                    value={curve}
                    onChange={(e) => setCurve(e.target.value)}
                    marks={difficultyNames}
                  />
                </Box>
              </RadioGroup>
              <br></br>
              <FormLabel>Strategic Depth</FormLabel>
              <RadioGroup>
                <Box sx={{ width: '15rem' }}>
                  <Slider
                    style={{ color: 'rgb(76, 180, 164)' }}
                    min={1}
                    max={5}
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                    valueLabelDisplay="auto"
                    marks={difficultyNames}
                  />
                </Box>
              </RadioGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      </form>
    </div>
  );
};
export default ShopMenu;
